
import { useState } from 'react';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface APIKeySettingsProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const APIKeySettings = ({ apiKey, onApiKeyChange, isOpen, onToggle }: APIKeySettingsProps) => {
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSave = () => {
    onApiKeyChange(tempKey);
    onToggle();
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-10"
      >
        <Settings size={16} />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>AI Settings</CardTitle>
          <CardDescription>
            Enter your OpenAI API key to enable AI responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="sk-..."
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save
            </Button>
            <Button onClick={onToggle} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Get your API key from{' '}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              OpenAI Platform
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIKeySettings;
