import Hero from "../components/section/Hero";
import { WorldMapDemo } from "../components/section/Worldmap";
import Features from "../components/section/Features";

export default function Home() {
    return (
        <div>
            <Hero />
            <WorldMapDemo />
            <Features />
        </div>
    );
}