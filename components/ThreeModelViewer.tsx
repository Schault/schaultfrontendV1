import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FaSync } from "react-icons/fa";
import ShoeViewerSkeleton from "./ShoeViewerSkeleton";

interface ThreeModelViewerProps {
  upperPath: string;
  solePath: string;
  onLoadingChange: (isLoading: boolean) => void;
}

// Global Promise cache for deduplicating in-flight and completed requests
const promiseCache = new Map<string, Promise<THREE.Group>>();

// Shared GLTF & Draco loader singleton
let sharedLoader: GLTFLoader | null = null;

function getLoader(): GLTFLoader {
  if (!sharedLoader) {
    sharedLoader = new GLTFLoader();
    if (typeof window !== "undefined") {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
      dracoLoader.setDecoderConfig({ type: "js" });
      sharedLoader.setDRACOLoader(dracoLoader);
    }
  }
  return sharedLoader;
}

// Preload a single model on-demand (e.g. on card hover)
export function preloadModel(path: string): Promise<THREE.Group> {
  if (promiseCache.has(path)) {
    return promiseCache.get(path)!;
  }
  const loader = getLoader();
  const promise = new Promise<THREE.Group>((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        resolve(gltf.scene);
      },
      undefined,
      (error) => {
        promiseCache.delete(path);
        console.error(`Failed to load model: ${path}`, error);
        reject(error);
      }
    );
  });
  promiseCache.set(path, promise);
  return promise;
}

// Memory-optimized deep cloning helper:
// Crucial: We reuse mesh.geometry instead of duplicating 54MB of vertex buffers on the main thread!
const cloneThreeObject = (object: THREE.Object3D): THREE.Object3D => {
  if (object instanceof THREE.Mesh) {
    const mesh = object.clone();
    // Share BufferGeometry to avoid freezing the CPU thread and exhausting RAM
    mesh.geometry = object.geometry;
    if (Array.isArray(object.material)) {
      mesh.material = object.material.map((material) => material.clone());
    } else {
      mesh.material = object.material.clone();
    }
    return mesh;
  }

  const cloned = object.clone();
  object.children.forEach((child) => {
    cloned.add(cloneThreeObject(child));
  });
  return cloned;
};

export default function ThreeModelViewer({
  upperPath,
  solePath,
  onLoadingChange,
}: ThreeModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("INITIALIZING 3D ENGINE");
  const autoRotateRef = useRef(true);

  // Refs to store Three.js objects for access in event handlers/cleanup
  const controlsRef = useRef<OrbitControls>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const groupRef = useRef<THREE.Group>();
  const initialCameraPosRef = useRef<THREE.Vector3>();

  useEffect(() => {
    if (!mountRef.current) return;
    setIsLoading(true);
    setProgress(5);
    setStatusMessage("REQUESTING 3D ASSETS");
    onLoadingChange(true);

    const currentMount = mountRef.current;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f2d1b);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    currentMount.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight2.position.set(-5, -10, -7.5);
    scene.add(directionalLight2);

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.autoRotate = false;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controlsRef.current = controls;

    const onUserInteract = () => {
      autoRotateRef.current = false;
    };
    controls.addEventListener("start", onUserInteract);

    // 6. Progressive Model Loading
    if (groupRef.current) {
      scene.remove(groupRef.current);
    }

    // Track download progress for Upper and Sole
    const progressTracker = {
      upper: { loaded: 0, total: 15 * 1024 * 1024 },
      sole: { loaded: 0, total: 54 * 1024 * 1024 },
    };

    const updateCombinedProgress = () => {
      const totalEstimated = progressTracker.upper.total + progressTracker.sole.total;
      const loaded = progressTracker.upper.loaded + progressTracker.sole.loaded;
      const pct = Math.min(Math.round((loaded / totalEstimated) * 100), 92);
      setProgress((prev) => Math.max(prev, pct));
      if (pct > 15 && pct < 85) {
        setStatusMessage(`STREAMING 3D GEOMETRY (${pct}%)`);
      } else if (pct >= 85) {
        setStatusMessage("PARSING SHADERS & MATERIALS");
      }
    };

    const loadWithProgress = (path: string, type: "upper" | "sole"): Promise<THREE.Group> => {
      // Check if already in cache
      if (promiseCache.has(path)) {
        progressTracker[type].loaded = progressTracker[type].total;
        updateCombinedProgress();
        return promiseCache.get(path)!.then((model) => cloneThreeObject(model) as THREE.Group);
      }

      const loader = getLoader();
      const promise = new Promise<THREE.Group>((resolve, reject) => {
        loader.load(
          path,
          (gltf) => {
            progressTracker[type].loaded = progressTracker[type].total;
            updateCombinedProgress();
            resolve(gltf.scene);
          },
          (xhr) => {
            if (xhr.lengthComputable && xhr.total > 0) {
              progressTracker[type].loaded = xhr.loaded;
              progressTracker[type].total = xhr.total;
            } else {
              progressTracker[type].loaded = xhr.loaded;
            }
            updateCombinedProgress();
          },
          (error) => {
            promiseCache.delete(path);
            console.error(`Error loading model ${path}:`, error);
            reject(error);
          }
        );
      });

      promiseCache.set(path, promise);
      return promise.then((model) => cloneThreeObject(model) as THREE.Group);
    };

    // Load ONLY the active pair (Upper + Sole)
    Promise.all([loadWithProgress(upperPath, "upper"), loadWithProgress(solePath, "sole")])
      .then(([upperModel, soleModel]) => {
        setProgress(98);
        setStatusMessage("ASSEMBLING MODULAR MESH");

        const group = new THREE.Group();
        group.add(upperModel);
        group.add(soleModel);
        groupRef.current = group;

        // Set initial 30-degree inclination and 180-degree Y start offset
        group.rotation.set(-Math.PI / 6, Math.PI, 0);

        // Center and frame the model group
        const box = new THREE.Box3().setFromObject(group);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        group.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

        camera.position.set(0, cameraZ * 1.5, cameraZ * 0.5);
        initialCameraPosRef.current = camera.position.clone();
        controls.target.set(0, 0, 0);
        controls.update();

        scene.add(group);
        setProgress(100);
        setIsLoading(false);
        onLoadingChange(false);
        autoRotateRef.current = true;

        // Idle warmup: After active pair is rendered, sequentially prefetch remaining models during idle time
        if (typeof window !== "undefined") {
          const warmupRemaining = () => {
            const backgroundModels = [
              "/assets/models/customizer/sole/sole_white.glb",
              "/assets/models/customizer/upper/White_and_Blue-lowres.glb",
              "/assets/models/customizer/upper/White_and_Yellow-lowres.glb",
            ].filter((p) => p !== upperPath && p !== solePath && !promiseCache.has(p));

            let idx = 0;
            const prefetchNext = () => {
              if (idx < backgroundModels.length) {
                preloadModel(backgroundModels[idx])
                  .catch(() => {})
                  .finally(() => {
                    idx++;
                    if ("requestIdleCallback" in window) {
                      (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(prefetchNext);
                    } else {
                      setTimeout(prefetchNext, 2000);
                    }
                  });
              }
            };
            prefetchNext();
          };

          if ("requestIdleCallback" in window) {
            (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(warmupRemaining);
          } else {
            setTimeout(warmupRemaining, 3000);
          }
        }
      })
      .catch((error) => {
        console.error("An error happened while loading models:", error);
        setStatusMessage("FAILED TO LOAD 3D ASSETS");
        setIsLoading(false);
        onLoadingChange(false);
      });

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (autoRotateRef.current && groupRef.current) {
        groupRef.current.rotation.y += 0.005;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      controls.removeEventListener("start", onUserInteract);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      scene.clear();
    };
  }, [upperPath, solePath, onLoadingChange]);


  const handleResetView = () => {
    if (controlsRef.current && cameraRef.current && initialCameraPosRef.current && groupRef.current) {
      const controls = controlsRef.current;
      const camera = cameraRef.current;
      const group = groupRef.current;

      // Reset camera position
      camera.position.copy(initialCameraPosRef.current);
      
      // Reset group rotation and position
      group.rotation.set(-Math.PI / 6, Math.PI, 0);
      const box = new THREE.Box3().setFromObject(group);
      const center = box.getCenter(new THREE.Vector3());
      group.position.sub(center);

      // Reset controls
      controls.target.set(0, 0, 0);
      controls.update();

      // Resume auto-rotation
      autoRotateRef.current = true;
    }
  };

  return (
    <div ref={mountRef} className="relative h-full w-full overflow-hidden">
      <div
        className={`transition-opacity duration-500 ease-in-out ${
          isLoading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <ShoeViewerSkeleton progress={progress} statusMessage={statusMessage} />
      </div>

      {!isLoading && (
        <button
          onClick={handleResetView}
          className="absolute top-3 right-3 z-20 rounded-full bg-white/10 p-3 text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white shadow-sm"
          aria-label="Reset View"
        >
          <FaSync />
        </button>
      )}
    </div>
  );
}

