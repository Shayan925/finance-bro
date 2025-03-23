import { Button } from "../components/ui/button";

interface ExamplePromptProps {
  text: string;
  onClick: (text: string) => void;
}

interface LandingPageProps {
  onExampleClick: (text: string) => void;
}

function ExamplePrompt({ text, onClick }: ExamplePromptProps) {
  return (
    <Button 
      variant="outline" 
      className="text-left h-auto w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      onClick={() => onClick(text)}
    >
      <p>{text}</p>
    </Button>
  );
}

export function LandingPage({ onExampleClick }: LandingPageProps) {
  const examples = [
    "What's the best way to start investing with $1000?",
    "Can you explain how ETFs work?",
    "What are the current market trends?",
    "How should I diversify my portfolio?",
    "What's the difference between stocks and bonds?"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Welcome to Finance Bro
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Ask me anything about stocks, market trends, or financial analysis. Try these examples:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples.map((example) => (
          <ExamplePrompt key={example} text={example} onClick={onExampleClick} />
        ))}
      </div>
    </div>
  );
} 