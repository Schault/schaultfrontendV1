import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FaSync } from "react-icons/fa";

interface ThreeModelViewerProps {
  upperPath: string;
  solePath: string;
  onLoadingChange: (isLoading: boolean) => void;
}

// Global model cache to prevent reloading the same models
const modelCache = new Map<string, THREE.Group>();

// Preload manager to track and preload models
const preloadManager = {
  preloadedPaths: new Set<string>(),
  preloadModel: async (path: string) => {
    if (preloadManager.preloadedPaths.has(path) || modelCache.has(path)) {
      return;
    }
    preloadManager.preloadedPaths.add(path);
    try {
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(path);
      modelCache.set(path, gltf.scene);
    } catch (error) {
      console.error(`Failed to preload model: ${path}`, error);
      preloadManager.preloadedPaths.delete(path);
    }
  },
};

// Helper function to clone a Three.js object deeply
const cloneThreeObject = (object: THREE.Object3D): THREE.Object3D => {
  if (object instanceof THREE.Mesh) {
    const mesh = object.clone();
    mesh.geometry = object.geometry.clone();
    if (Array.isArray(object.material)) {
      mesh.material = object.material.map(material => material.clone());
    } else {
      mesh.material = object.material.clone();
    }
    return mesh;
  }
  
  const cloned = object.clone();
  object.children.forEach(child => {
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
  const autoRotateRef = useRef(true);

  // Refs to store Three.js objects for access in event handlers/cleanup
  const controlsRef = useRef<OrbitControls>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const groupRef = useRef<THREE.Group>();
  const initialCameraPosRef = useRef<THREE.Vector3>();

  // Preload all models on component mount
  useEffect(() => {
    // Get all model paths from the page context
    const allModelPaths = [
      "/assets/models/customizer/upper/Ocre_and_Olive-lowres.glb",
      "/assets/models/customizer/upper/White_and_Blue-lowres.glb",
      "/assets/models/customizer/upper/White_and_Yellow-lowres.glb",
      "/assets/models/customizer/upper/Red_and_Black-lowres.glb",
      "/assets/models/customizer/upper/Blue_Sun-lowres.glb",
      "/assets/models/customizer/sole/sole_black.glb",
      "/assets/models/customizer/sole/sole_white.glb",
    ];

    // Preload all models in the background (non-blocking)
    allModelPaths.forEach((path) => {
      preloadManager.preloadModel(path);
    });
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    setIsLoading(true);
    onLoadingChange(true);

    const currentMount = mountRef.current;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f2d1b); // Dark green background

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
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    currentMount.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0); // Increased intensity
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
    controls.enablePan = false; // Disable panning to keep shoe centered
    controls.autoRotate = false; // We handle auto-rotation manually
    controls.enableZoom = true; // Allow zooming
    controls.enableRotate = true; // Allow rotation
    controlsRef.current = controls;

    // Stop auto-rotation on user interaction
    const onUserInteract = () => {
      autoRotateRef.current = false;
    };
    controls.addEventListener("start", onUserInteract);

    // 6. Model Loading with Cache
    // Clear previous models
    if (groupRef.current) {
      scene.remove(groupRef.current);
    }

    const loader = new GLTFLoader();
    
    // Function to load or get from cache
    const loadModel = async (path: string): Promise<THREE.Group> => {
      // Check if model is already cached
      if (modelCache.has(path)) {
        const cachedModel = modelCache.get(path)!;
        return cloneThreeObject(cachedModel) as THREE.Group;
      }
      
      // Load the model
      const gltf = await loader.loadAsync(path);
      const model = gltf.scene;
      
      // Store in cache for future use
      modelCache.set(path, model);
      
      return cloneThreeObject(model) as THREE.Group;
    };

    Promise.all([loadModel(upperPath), loadModel(solePath)])
      .then(([upperModel, soleModel]) => {
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
        initialCameraPosRef.current = camera.position.clone(); // Save initial position
        controls.target.set(0, 0, 0);
        controls.update();

        scene.add(group);
        setIsLoading(false);
        onLoadingChange(false);
        autoRotateRef.current = true; // Resume auto-rotation for new model
      })
      .catch((error) => {
        console.error("An error happened while loading models:", error);
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
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      scene.clear();
    };
  }, [upperPath, solePath, onLoadingChange]); // Rerun effect when models change

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
    <div ref={mountRef} className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <p className="font-inter text-sm font-medium text-white">Loading Model...</p>
        </div>
      )}
      <button
        onClick={handleResetView}
        className="absolute top-3 right-3 z-10 rounded-full bg-white/10 p-3 text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
        aria-label="Reset View"
      >
        <FaSync />
      </button>
    </div>
  );
}
