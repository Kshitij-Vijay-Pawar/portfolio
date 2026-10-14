import AnimatedTypewriter from '@/app/components/AnimatedTypewriter/AnimatedTypewriter';

export default function TestPage() {
  const sampleStrings = ['Creating thoughtful digital experiences.'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-8">
      <AnimatedTypewriter strings={sampleStrings} />
    </div>
  );
}