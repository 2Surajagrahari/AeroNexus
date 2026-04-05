"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap, Plane, Globe, CloudLightning, Fuel, ShieldCheck } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Internal data perfectly tailored for AeroNexus
const aeroTimelineData = [
    {
        id: 1,
        title: "Global Data Sync",
        date: "Phase 1",
        content: "Syncing global airport coordinates and aviation traffic data via external APIs.",
        category: "Infrastructure",
        icon: Globe,
        relatedIds: [2, 3],
        status: "completed",
        energy: 100,
    },
    {
        id: 2,
        title: "Weather Matrix Integration",
        date: "Phase 2",
        content: "Pulling live weather grids to identify storm cells, turbulence, and wind shear.",
        category: "Data",
        icon: CloudLightning,
        relatedIds: [4],
        status: "in-progress",
        energy: 85,
    },
    {
        id: 3,
        title: "Flight Path Algorithms",
        date: "Phase 3",
        content: "C++ backend applying Dijkstra's algorithm for highly optimized pathfinding computation.",
        category: "AI Computation",
        icon: Plane,
        relatedIds: [4, 5],
        status: "pending",
        energy: 60,
    },
    {
        id: 4,
        title: "Fuel Efficiency Models",
        date: "Phase 4",
        content: "Calculating optimal fuel burn using predictive machine learning models.",
        category: "Optimization",
        icon: Fuel,
        relatedIds: [5],
        status: "pending",
        energy: 40,
    },
    {
        id: 5,
        title: "Safety Verification",
        date: "Phase 5",
        content: "Pre-flight validation protocols ensuring safe passage around restricted airspace.",
        category: "Security",
        icon: ShieldCheck,
        relatedIds: [],
        status: "pending",
        energy: 20,
    }
];

export default function Features() {
    const timelineData = aeroTimelineData;
    const [expandedItems, setExpandedItems] = useState({});
    const [viewMode, setViewMode] = useState("orbital");
    const [rotationAngle, setRotationAngle] = useState(0);
    const [autoRotate, setAutoRotate] = useState(true);
    const [pulseEffect, setPulseEffect] = useState({});
    const [centerOffset, setCenterOffset] = useState({ x: 0, y: 0 });
    const [activeNodeId, setActiveNodeId] = useState(null);
    const containerRef = useRef(null);
    const orbitRef = useRef(null);
    const nodeRefs = useRef({});

    const handleContainerClick = (e) => {
        if (e.target === containerRef.current || e.target === orbitRef.current) {
            setExpandedItems({});
            setActiveNodeId(null);
            setPulseEffect({});
            setAutoRotate(true);
        }
    };

    const toggleItem = (id) => {
        setExpandedItems((prev) => {
            const newState = { ...prev };
            Object.keys(newState).forEach((key) => {
                if (parseInt(key) !== id) {
                    newState[parseInt(key)] = false;
                }
            });

            newState[id] = !prev[id];

            if (!prev[id]) {
                setActiveNodeId(id);
                setAutoRotate(false);

                const relatedItems = getRelatedItems(id);
                const newPulseEffect = {};
                relatedItems.forEach((relId) => {
                    newPulseEffect[relId] = true;
                });
                setPulseEffect(newPulseEffect);

                centerViewOnNode(id);
            } else {
                setActiveNodeId(null);
                setAutoRotate(true);
                setPulseEffect({});
            }

            return newState;
        });
    };

    useEffect(() => {
        let rotationTimer;

        if (autoRotate && viewMode === "orbital") {
            rotationTimer = setInterval(() => {
                setRotationAngle((prev) => {
                    const newAngle = (prev + 0.15) % 360;
                    return Number(newAngle.toFixed(3));
                });
            }, 16); // 60 FPS instead of 20 FPS
        }

        return () => {
            if (rotationTimer) {
                clearInterval(rotationTimer);
            }
        };
    }, [autoRotate, viewMode]);

    const centerViewOnNode = (nodeId) => {
        if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

        const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
        const totalNodes = timelineData.length;
        const targetAngle = (nodeIndex / totalNodes) * 360;

        setRotationAngle(270 - targetAngle);
    };

    const calculateNodePosition = (index, total) => {
        const angle = ((index / total) * 360 + rotationAngle) % 360;
        const radius = 220; // Increased radius slightly so nodes have more room
        const radian = (angle * Math.PI) / 180;

        const x = radius * Math.cos(radian) + centerOffset.x;
        const y = radius * Math.sin(radian) + centerOffset.y;

        const zIndex = Math.round(100 + 50 * Math.cos(radian));
        const opacity = Math.max(
            0.4,
            Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
        );

        return { x, y, angle, zIndex, opacity };
    };

    const getRelatedItems = (itemId) => {
        const currentItem = timelineData.find((item) => item.id === itemId);
        return currentItem ? currentItem.relatedIds : [];
    };

    const isRelatedToActive = (itemId) => {
        if (!activeNodeId) return false;
        const relatedItems = getRelatedItems(activeNodeId);
        return relatedItems.includes(itemId);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "completed":
                return "text-white bg-black border-white";
            case "in-progress":
                return "text-black bg-white border-black";
            case "pending":
                return "text-white bg-black/40 border-white/50";
            default:
                return "text-white bg-black/40 border-white/50";
        }
    };

    return (
        <div
            className="w-full min-h-screen py-24 flex flex-col items-center justify-center bg-black overflow-hidden relative z-10"
            ref={containerRef}
            onClick={handleContainerClick}
        >
            <div className="absolute top-20 text-center text-white z-20 pointer-events-none">
                <h2 className="text-3xl md:text-5xl font-extralight tracking-tight mb-4">Core Systems Overview</h2>
                <p className="text-white/70 font-light max-w-xl mx-auto px-4">Explore the computational modules powering AeroNexus in real-time. Interact with the nodes to see active infrastructure data.</p>
            </div>
            
            <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center mt-12">
                <div
                    className="absolute w-full h-full flex items-center justify-center"
                    ref={orbitRef}
                    style={{
                        perspective: "1000px",
                        transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
                    }}
                >
                    {/* Center Core */}
                    <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500 animate-pulse flex items-center justify-center z-10">
                        <div className="absolute w-28 h-28 rounded-full border border-white/20 animate-ping opacity-70"></div>
                        <div
                            className="absolute w-36 h-36 rounded-full border border-white/10 animate-ping opacity-50"
                            style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.8)]"></div>
                    </div>

                    <div className="absolute w-[440px] h-[440px] rounded-full border border-white/10 border-dashed"></div>

                    {timelineData.map((item, index) => {
                        const position = calculateNodePosition(index, timelineData.length);
                        const isExpanded = expandedItems[item.id];
                        const isRelated = isRelatedToActive(item.id);
                        const isPulsing = pulseEffect[item.id];
                        const Icon = item.icon;

                        const nodeStyle = {
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            zIndex: isExpanded ? 200 : position.zIndex,
                            opacity: isExpanded ? 1 : position.opacity,
                        };

                        return (
                            <div
                                key={item.id}
                                ref={(el) => (nodeRefs.current[item.id] = el)}
                                className={`absolute cursor-pointer ${!autoRotate ? "transition-all duration-700 ease-in-out" : ""}`}
                                style={nodeStyle}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(item.id);
                                }}
                            >
                                <div
                                    className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse duration-1000" : ""
                                        }`}
                                    style={{
                                        background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                                        width: `${item.energy * 0.5 + 40}px`,
                                        height: `${item.energy * 0.5 + 40}px`,
                                        left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                                        top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                                    }}
                                ></div>

                                <div
                                    className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${isExpanded
                                            ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                                            : isRelated
                                                ? "bg-white/50 text-black"
                                                : "bg-black text-white"
                                        }
                  border-2 
                  ${isExpanded
                                            ? "border-white"
                                            : isRelated
                                                ? "border-white animate-pulse"
                                                : "border-white/40"
                                        }
                  transition-all duration-300 transform hover:scale-110
                  ${isExpanded ? "scale-125" : ""}
                `}
                                >
                                    <Icon size={20} />
                                </div>

                                <div
                                    className={`
                  absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap
                  text-xs font-semibold tracking-wider uppercase
                  transition-all duration-300 pointer-events-none
                  ${isExpanded ? "text-white opacity-0" : "text-white/70"}
                `}
                                >
                                    {item.title}
                                </div>

                                {isExpanded && (
                                    <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl overflow-visible text-left z-50">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-white/50"></div>
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-center">
                                                <Badge
                                                    className={`px-2 py-0 h-5 text-[10px] uppercase font-bold tracking-widest rounded-sm ${getStatusStyles(
                                                        item.status
                                                    )}`}
                                                >
                                                    {item.status.replace("-", " ")}
                                                </Badge>
                                                <span className="text-xs font-mono text-white/50 tracking-wider">
                                                    {item.date}
                                                </span>
                                            </div>
                                            <CardTitle className="text-lg mt-3 font-medium tracking-tight text-white">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm text-white/80 pb-4">
                                            <p className="font-light leading-relaxed">{item.content}</p>

                                            <div className="mt-5 pt-4 border-t border-white/10">
                                                <div className="flex justify-between items-center text-xs mb-2">
                                                    <span className="flex items-center text-white/60 font-medium uppercase tracking-widest text-[10px]">
                                                        <Zap size={12} className="mr-1 text-yellow-500" />
                                                        Computation Load
                                                    </span>
                                                    <span className="font-mono text-white/90">{item.energy}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                                                        style={{ width: `${item.energy}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {item.relatedIds.length > 0 && (
                                                <div className="mt-5 pt-3 border-t border-white/10">
                                                    <div className="flex items-center mb-3">
                                                        <Link size={12} className="text-white/50 mr-1.5" />
                                                        <h4 className="text-[10px] uppercase tracking-widest font-medium text-white/50">
                                                            Connected Nodes
                                                        </h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.relatedIds.map((relatedId) => {
                                                            const relatedItem = timelineData.find(
                                                                (i) => i.id === relatedId
                                                            );
                                                            return (
                                                                <Button
                                                                    key={relatedId}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="flex items-center h-7 px-3 py-0 text-xs rounded-full border border-white/10 bg-white/5 hover:bg-white/20 text-white/70 hover:text-white transition-all shadow-none"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleItem(relatedId);
                                                                    }}
                                                                >
                                                                    <span className="truncate max-w-[120px] font-medium">{relatedItem?.title}</span>
                                                                    <ArrowRight
                                                                        size={10}
                                                                        className="ml-1.5 shrink-0 opacity-50"
                                                                    />
                                                                </Button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
