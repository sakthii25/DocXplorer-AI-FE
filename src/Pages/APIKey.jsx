import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Copy, KeyRound, Trash2 } from "lucide-react";
import { toast } from "sonner"

const ApiKey = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKey, setNewKey] = useState(null);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const user_data = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const BASE_URL = "http://0.0.0.0:8000"

  useEffect(() => {
    let payload = {"user_email": user_data["email"]}
    fetch(`${BASE_URL}/list-apikeys`,{
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      let keys = data['api_keys'] 
      setApiKeys(keys)
    })
    .catch(error => console.error('Error:', error));

  },[])

  const handleGenerateApiKey = () => {
    if (apiKeys.length >= 5) {
        toast.error("Maximum limit of 5 API keys reached")
        return;
    }
    const prefix = 'sk-'; 
    const uuid = uuidv4().replace(/-/g, ''); 
    const randomPart = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now().toString(36);
    const fullKey = `${prefix}${uuid}${randomPart}${timestamp}`;
    

    const generatedKey = {
        // id: `key_${Math.random().toString(36).substring(2, 10)}`,
        key: fullKey,
        createdAt: new Date().toISOString(),
    };
    let payload = {user_email: user_data['email'], api_key: fullKey, created_at: new Date().toISOString()}
    fetch(`${BASE_URL}/add-apikey`,
      { method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )
    .then(response => response.json())
    .then(_ => {
      toast.success("API key created successfully");
    })
    .catch(error => console.error('Error:', error));

    setNewKey(generatedKey);
    console.log(showNewKeyDialog)
    setShowNewKeyDialog(true);
    console.log(showNewKeyDialog)
    if (showNewKeyDialog==false){
        setApiKeys([...apiKeys, generatedKey]);
    }
  };

  const maskApiKey = (key) => {
    const visibleStart = key.slice(0, 4); // First 6 characters
    const visibleEnd = key.slice(-3);
    const masked = `${visibleStart}...${visibleEnd}`;
    return masked;
  };
  
  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setShowNewKeyDialog(false);
    toast.success("API key copied to clipboard");
  }; 

  const handleDeleteKey = (id) => {

    console.log(id)
    let payload = {user_email:  user_data['email'], api_key: id};
    console.log(payload)
    fetch(`${BASE_URL}/delete-apikey`,
      { method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )
    .then(response => response.json())
    .then(_ => {
      setApiKeys(apiKeys.filter(key => key.key !== id)); 
      toast.success("API key deleted successfully");
    })
    .catch(error => {
      console.error('Error:', error)
      toast.error("API key deletion failed")
    });
  };
  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate('/home')}
      >
        ← Back to Documents
      </Button>

      <h1 className="text-3xl font-bold mb-8">API Key Management</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API Keys ({apiKeys.length}/5)</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGenerateApiKey}
            disabled={apiKeys.length >= 5}
          >
            <KeyRound className="mr-2" />
            Generate New API Key
          </Button>

          <div className="mt-6 space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-mono text-sm mb-1">{maskApiKey(apiKey.key)}</p>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteKey(apiKey.key)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New API Key Generated</DialogTitle>
            <DialogDescription>
              Please copy your API key now. For security reasons, you won't be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4">
              {newKey?.key}
            </div>
            <Button
              onClick={() => newKey && handleCopyKey(newKey.key)}
              className="w-full"
            >
              <Copy className="mr-2" />
              Copy API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiKey;
