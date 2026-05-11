import { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TOOTH_COUNT = 14;

interface ToothData {
  id: string;
  position: [number, number, number];
  rotation: number;
  scale: [number, number, number];
}

function buildTeethData(): ToothData[] {
  const teeth: ToothData[] = [];
  const radius = 3.2;

  for (let i = 0; i < TOOTH_COUNT; i++) {
    const angle = (i / (TOOTH_COUNT - 1)) * Math.PI - Math.PI / 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * (radius * 0.75);
    teeth.push({ id: `U${i}`, position: [x, 1.2, z], rotation: angle, scale: [0.75, 1, 0.7] });
  }
  for (let i = 0; i < TOOTH_COUNT; i++) {
    const angle = (i / (TOOTH_COUNT - 1)) * Math.PI - Math.PI / 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * (radius * 0.75);
    teeth.push({ id: `L${i}`, position: [x, -1.2, z], rotation: angle, scale: [0.65, 0.85, 0.65] });
  }
  return teeth;
}

const TEETH_DATA = buildTeethData();

type ViewMode = "normal" | "cleaning" | "whitening";
type BracesStyle = "none" | "metal" | "ceramic" | "gold";

const BRACES_COLORS: Record<BracesStyle, string> = {
  none: "#f8f8ff",
  metal: "#94a3b8",
  ceramic: "#fef9f0",
  gold: "#fbbf24",
};

export default function ThreeDTeeth() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const toothMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const animFrameRef = useRef<number>(0);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ theta: 0, phi: 0.2 });
  const jawGroupRef = useRef<THREE.Group | null>(null);

  const [problemTeeth, setProblemTeeth] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("normal");
  const [bracesStyle, setBracesStyle] = useState<BracesStyle>("none");
  const [hoveredTooth, setHoveredTooth] = useState<string | null>(null);

  const getToothColor = useCallback(
    (id: string): string => {
      if (problemTeeth.has(id)) return "#ef4444";
      if (id === hoveredTooth) return "#bfdbfe";
      if (viewMode === "whitening") return "#ffffff";
      if (viewMode === "cleaning") return "#f0f9ff";
      return BRACES_COLORS[bracesStyle];
    },
    [problemTeeth, hoveredTooth, viewMode, bracesStyle]
  );

  const updateToothColors = useCallback(() => {
    toothMeshesRef.current.forEach((group, id) => {
      const color = getToothColor(id);
      group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          (obj.material as THREE.MeshStandardMaterial).color.set(color);
        }
      });
    });
  }, [getToothColor]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0f172a");
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 2, 10);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      const msg = document.createElement("div");
      msg.style.cssText = "display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-family:sans-serif;text-align:center;padding:2rem;background:#0f172a;";
      msg.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' fill='none' viewBox='0 0 24 24' style='margin-bottom:1rem;opacity:0.4'><path stroke='#94a3b8' stroke-width='1.5' d='M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Z'/><path stroke='#94a3b8' stroke-width='1.5' stroke-linecap='round' d='M9 9l6 6M15 9l-6 6'/></svg><p style='font-size:1.1rem;font-weight:600;color:#e2e8f0;margin-bottom:.5rem'>النموذج ثلاثي الأبعاد يتطلب متصفحاً يدعم WebGL</p><p style='font-size:.85rem;opacity:.6'>يعمل بشكل مثالي في Chrome وFirefox وSafari الحديثة</p>`;
      container.appendChild(msg);
      return () => { if (container.contains(msg)) container.removeChild(msg); };
    }
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const spot = new THREE.SpotLight(0xffffff, 1.5);
    spot.position.set(8, 10, 8);
    spot.castShadow = true;
    spot.shadow.mapSize.width = 1024;
    spot.shadow.mapSize.height = 1024;
    scene.add(spot);
    const fill = new THREE.PointLight(0x6cb4e4, 0.8);
    fill.position.set(-6, -4, 6);
    scene.add(fill);
    const backLight = new THREE.PointLight(0xffeedd, 0.5);
    backLight.position.set(0, 0, -8);
    scene.add(backLight);

    // Jaw group
    const jawGroup = new THREE.Group();
    jawGroup.rotation.y = Math.PI;
    scene.add(jawGroup);
    jawGroupRef.current = jawGroup;

    // Build teeth
    const toothMap = new Map<string, THREE.Group>();

    TEETH_DATA.forEach(({ id, position, rotation, scale }) => {
      const group = new THREE.Group();
      group.position.set(...position);
      group.rotation.y = rotation;
      group.scale.set(...scale);

      // Tooth body
      const bodyGeo = new THREE.BoxGeometry(1, 1.4, 0.85);
      bodyGeo.translate(0, 0, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: BRACES_COLORS.none,
        roughness: 0.18,
        metalness: 0.08,
        envMapIntensity: 1.2,
      });
      const body = new THREE.Mesh(bodyGeo, mat.clone());
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      // Crown bump
      const crownGeo = new THREE.SphereGeometry(0.52, 12, 12);
      const crown = new THREE.Mesh(crownGeo, mat.clone());
      crown.position.y = 0.72;
      crown.scale.y = 0.6;
      crown.castShadow = true;
      group.add(crown);

      jawGroup.add(group);
      toothMap.set(id, group);
    });

    toothMeshesRef.current = toothMap;

    // Gums
    const gumMat = new THREE.MeshStandardMaterial({ color: "#c0607a", roughness: 0.5 });
    const upperGumGeo = new THREE.TorusGeometry(3.0, 0.55, 12, 32, Math.PI);
    const upperGum = new THREE.Mesh(upperGumGeo, gumMat);
    upperGum.position.set(0, 1.85, 0.8);
    upperGum.rotation.x = Math.PI / 2;
    jawGroup.add(upperGum);

    const lowerGumGeo = new THREE.TorusGeometry(3.0, 0.5, 12, 32, Math.PI);
    const lowerGum = new THREE.Mesh(lowerGumGeo, gumMat);
    lowerGum.position.set(0, -1.85, 0.8);
    lowerGum.rotation.x = Math.PI / 2;
    jawGroup.add(lowerGum);

    // Grid / floor hint
    const gridHelper = new THREE.GridHelper(20, 20, "#1e293b", "#1e293b");
    gridHelper.position.y = -4.5;
    scene.add(gridHelper);

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedTooth = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const meshes: THREE.Mesh[] = [];
      toothMap.forEach((group, id) => {
        group.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            (obj as any).__toothId = id;
            meshes.push(obj as THREE.Mesh);
          }
        });
      });
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length > 0) {
        return (hits[0].object as any).__toothId as string;
      }
      return null;
    };

    const onClick = (e: MouseEvent) => {
      const id = getIntersectedTooth(e.clientX, e.clientY);
      if (id) {
        setProblemTeeth((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        rotationRef.current.theta -= dx * 0.008;
        rotationRef.current.phi = Math.max(-0.5, Math.min(1.0, rotationRef.current.phi + dy * 0.008));
        lastMouse.current = { x: e.clientX, y: e.clientY };
      } else {
        setHoveredTooth(getIntersectedTooth(e.clientX, e.clientY));
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging.current = false; };

    const onTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - lastMouse.current.x;
      const dy = e.touches[0].clientY - lastMouse.current.y;
      rotationRef.current.theta -= dx * 0.008;
      rotationRef.current.phi = Math.max(-0.5, Math.min(1.0, rotationRef.current.phi + dy * 0.008));
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging.current = false; };

    const onWheel = (e: WheelEvent) => {
      camera.position.z = Math.max(5, Math.min(16, camera.position.z + e.deltaY * 0.02));
    };

    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("touchstart", onTouchStart);
    renderer.domElement.addEventListener("touchmove", onTouchMove);
    renderer.domElement.addEventListener("touchend", onTouchEnd);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: true });

    const handleResize = () => {
      if (!canvasRef.current) return;
      const w2 = canvasRef.current.clientWidth;
      const h2 = canvasRef.current.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (jawGroupRef.current) {
        jawGroupRef.current.rotation.y = Math.PI + rotationRef.current.theta;
        jawGroupRef.current.rotation.x = rotationRef.current.phi;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("touchstart", onTouchStart);
      renderer.domElement.removeEventListener("touchmove", onTouchMove);
      renderer.domElement.removeEventListener("touchend", onTouchEnd);
      renderer.domElement.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    updateToothColors();
  }, [updateToothColors]);

  const handleClearProblems = () => setProblemTeeth(new Set());
  const handleSimulateCleaning = () => { setViewMode("cleaning"); setProblemTeeth(new Set()); };
  const handleSimulateWhitening = () => { setViewMode("whitening"); setProblemTeeth(new Set()); };
  const handleNormal = () => setViewMode("normal");

  return (
    <div dir="rtl" className="flex flex-col md:flex-row" style={{ height: "calc(100dvh - 4rem)" }}>
      {/* 3D Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 relative select-none"
        style={{ minHeight: 320, cursor: isDragging.current ? "grabbing" : "grab" }}
      >
        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-10">
          <p className="text-xs text-white/70 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            اسحب للتدوير • مرر للتقريب • انقر على السن لتحديد مشكلة
          </p>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-full md:w-80 lg:w-96 bg-[#0B1B3E] border-r border-white/10 overflow-y-auto shadow-2xl z-10 flex flex-col text-right">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white mb-1">النموذج التفاعلي ثلاثي الأبعاد</h2>
          <p className="text-sm text-white/60">استكشف صحة أسنانك وخيارات العلاج المتاحة.</p>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-7">
          {/* View Mode */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">محاكاة العلاج</h3>
            <div className="grid grid-cols-3 gap-2">
              {(["normal", "cleaning", "whitening"] as ViewMode[]).map((m) => (
                <button
                  key={m}
                  data-testid={`btn-mode-${m}`}
                  onClick={m === "cleaning" ? handleSimulateCleaning : m === "whitening" ? handleSimulateWhitening : handleNormal}
                  className={cn(
                    "py-2.5 rounded-lg text-xs font-medium border transition-all",
                    viewMode === m
                      ? "bg-white text-[#0B1B3E] border-white"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  )}
                >
                  {m === "normal" ? "طبيعي" : m === "cleaning" ? "تنظيف" : "تبييض"}
                </button>
              ))}
            </div>
          </div>

          {/* Braces */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">نوع التقويم</h3>
            <div className="grid grid-cols-2 gap-2">
              {([
                { key: "none", label: "بدون" },
                { key: "metal", label: "معدني" },
                { key: "ceramic", label: "سيراميك" },
                { key: "gold", label: "ذهبي" },
              ] as { key: BracesStyle; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  data-testid={`btn-braces-${key}`}
                  onClick={() => { setBracesStyle(key); setViewMode("normal"); }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-sm",
                    bracesStyle === key
                      ? "bg-white/15 border-white/40 text-white"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  )}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                    style={{ backgroundColor: BRACES_COLORS[key] }}
                  />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Problem Teeth */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">الأسنان المحددة</h3>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 min-h-[72px]">
              {problemTeeth.size === 0 ? (
                <p className="text-white/40 text-xs leading-relaxed">
                  لم يتم تحديد أي أسنان بعد. انقر على سن في النموذج لتمييزه كمنطقة مشكلة.
                </p>
              ) : (
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {[...problemTeeth].map((id) => (
                      <span
                        key={id}
                        className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-xs font-medium border border-red-500/30"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                  <button
                    data-testid="btn-clear-problems"
                    onClick={handleClearProblems}
                    className="text-xs text-white/50 hover:text-white/80 transition-colors"
                  >
                    مسح التحديد
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Booking CTA */}
          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="bg-white/8 rounded-xl p-4 border border-white/10 space-y-3">
              <p className="text-sm text-white/80 font-medium">هل لاحظت مشكلة؟</p>
              <p className="text-xs text-white/50">احجز موعدك الآن مع د. أحمد المنصوري للكشف والعلاج.</p>
              <Button
                data-testid="btn-book-from-3d"
                className="w-full bg-white text-[#0B1B3E] hover:bg-white/90 font-semibold text-sm"
                onClick={() => window.location.href = "/contact"}
              >
                احجز موعداً
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
