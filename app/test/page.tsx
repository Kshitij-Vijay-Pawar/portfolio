"use client";

import DitherVeil from "../components/ui/DitherVeil";
import image from "@/public/images/Modern Developer Profile Portrait.png"
import TechText from "../components/ui/TechText";
import ScrollReveal from "../components/ui/ScrollReveal";
import OptionWheel from "../components/ui/OptionWheel";
export default function TestPage() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-8">
        <h1 className="text-xl font-medium">Test page</h1>
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
          <DitherVeil
            src={typeof image === "string" ? image : image.src}
            pattern="floyd"
            pixelSize={2}
            inkColor="#120f17"
            paperColor="#f4f1ea"
            revealRadius={200}
            softness={0.6}
            linger={1}
            fit="contain"
            rimColor="#a78bfa"
            palette="duotone"
            levels={2}
            contrast={1.15}
            brightness={0}
            rim={0}
            reverse={false}
            wander={false}
            clickBurst
          />
        </div>

        <div style={{ width: '100%', height: '480px', position: 'relative' }}>
          <TechText
            text="React Bits"
            fontWeight={600}
            fontSize={150}
            reveal="letter"
            dashLength={4}
            dashGap={2}
            specks={15}
            fontFamily=""
            color="#ffffff"
            accentColor="#ffffff"
            letterSpacing={-0.05}
            reach={200}
            softness={0.7}
            strokeWidth={1.5}
            speed={1}
            lineStyle="dashed"
            selection
            labels
            draggable
            sweep
          />
        </div>

        <ScrollReveal
          baseOpacity={0.1}
          enableBlur
          baseRotation={3}
          blurStrength={4}
        >
          When does a man die? When he is hit by a bullet? No! When he suffers a disease?
          No! When he ate a soup made out of a poisonous mushroom?
          No! A man dies when he is forgotten!
        </ScrollReveal>
      </div>

      <OptionWheel
        items={['Ambient', 'House', 'Techno', 'Jazz', 'Lo-Fi', 'Synthwave']}
        defaultSelected={2}
        textColor="#a6a6a6"
        activeColor="#ffffff"
        side="left"
        fontSize={3}
        spacing={1.4}
        curve={1}
        tilt={6}
        blur={2}
        fade={0.25}
        smoothing={200}
        inset={80}
        loop={false}
        draggable
        soundUrl="/assets/sounds/click-soft.mp3"
        soundVolume={0.5}
        onChange={(index, item) => console.log(index, item)}
      />
    </>
  );
}





