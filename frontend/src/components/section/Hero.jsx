import AuroraHero from "@/components/ui/digital-aurora";

export default function DemoOne() {

    return <AuroraHero
        title="AeroNexus"
        description="Optimized Flight Path Planning using AI and Machine Learning."
        badgeText="AI-Powered Flight Path Optimization "
        badgeLabel="AeroNexus "
        ctaButtons={[
            { text: "Explore Now", href: "#", primary: true },
            { text: "Learn More", href: "#" }
        ]}
        microDetails={["Weather-aware route optimization", "Fuel-efficient flight path planning ", "Real-time weather integration  "]}
    />
        ;
}