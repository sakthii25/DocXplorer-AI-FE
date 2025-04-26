import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FolderPlus, Key, FileText, Upload, Bot, Code } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
// import { useToast } from "@/components/hooks/use-toast"

const Core = () => {
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [isGenerateKeyOpen, setIsGenerateKeyOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [summaryCollectionName, setSummaryCollectionName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isTestBotOpen, setIsTestBotOpen] = useState(false);
  const [isWidgetCodeOpen, setIsWidgetCodeOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/getdocuments",
      { method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
      }
    )
    .then(response => response.json())
    .then(data => {
      let docs = data['result']
      setDocuments(docs)
      console.log(data)
    })
    .catch(error => console.error('Error:', error));
  },[])

  const handleCreateCollection = () => {
    if (!collectionName) {
      Toaster({
        title: "Error",
        description: "Please enter a collection name",
        variant: "destructive",
      });
      return;
    }
    let payload = {"collection_name": collectionName, "summary_collection_name": summaryCollectionName}
    fetch("http://127.0.0.1:8000/create-collection", 
      {method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
    .then(response => response.json())
    .then(_ => Toaster({
        title: "Success",
        description: `Collection "${collectionName}" created successfully!`,
      }))
    .catch(error => console.error('Error:', error));

    // setCollectionName('');
    setIsCreateCollectionOpen(false);
  };

  const handleGenerateApiKey = () => {
    const newApiKey = `key_${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newApiKey);

    // toast({
    //   title: "API Key Generated",
    //   description: "Your API key has been generated successfully!",
    // });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };       

  const handleUploadDocument = () => {
    if (!selectedFile) {
    //   toast({
    //     title: "Error",
    //     description: "Please select a file to upload",
    //     variant: "destructive",
    //   });
      return;
    }

    let formData = new FormData();
    let json_str = {"collection_name" :  collectionName,"summary_collection_name" : summaryCollectionName}
    formData.append("file",selectedFile)
    formData.append("json_str",JSON.stringify(json_str))

    fetch("http://127.0.0.1:8000/index-docs",
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setDocuments([...documents, data]);
      })
      .catch(error => console.error('Error:', error))

    // toast({
    //   title: "Upload Successful",
    //   description: `File "${selectedFile.name}" uploaded successfully!`,
    // });

    setSelectedFile(null);
    setIsUploadOpen(false);
  };

  const handleSendMessage = () => {
      if (!userMessage.trim()) return;
      setChatMessages([...chatMessages, {role: 'user', content: userMessage}])
      setUserMessage('');
      let payload = {"query" : userMessage, "collection_name": collectionName, "summary_collection_name": summaryCollectionName}
      fetch("http://0.0.0.0:8000/query-docs",
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          console.log(data['response'])
          const newMessages = [
            ...chatMessages,
            {role: 'bot', content: data['response']}
          ]
          setChatMessages(newMessages);
        })
        .catch(error => console.error('Error:', error))
    };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const widgetCode = `<iframe
      src="https://your-domain.com/widget"
      width="100%"
      height="600px"
      frameborder="0"
    ></iframe>`;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">DocXplorer AI</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5" />
              Collections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Create a new collection to index your files.</p>
            <Button onClick={() => setIsCreateCollectionOpen(true)}>{collectionName != "" ? "Show Collection" : "Create Collection"}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Generate API keys to access via widget</p>
            <Button onClick={() => setIsGenerateKeyOpen(true)}>Generate API Key</Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Test Bot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Test your document chatbot to see how it interacts with users.</p>
            <Button onClick={() => setIsTestBotOpen(true)}>Open Chat</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Get Widget Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Get the embed code for your chatbot widget.</p>
            <Button onClick={() => setIsWidgetCodeOpen(true)}>View Code</Button>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
          <Button onClick={() => setIsUploadOpen(true)} className="flex items-center gap-1">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document ID</TableHead>
                  <TableHead>Document Name</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Uploaded Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.id}</TableCell>
                      <TableCell>{doc.document_name}</TableCell>
                      <TableCell>{doc.document_size}</TableCell>
                      <TableCell>{doc.uploaded_date}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No documents found. Upload your first document to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Collection Dialog */}
      <Dialog open={isCreateCollectionOpen} onOpenChange={setIsCreateCollectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="collection-name">Collection Name</Label>
              <Input
                id="collection-name"
                placeholder="Enter collection name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
              />
              <Label htmlFor="collection-name">Summary Collection Name</Label>
              <Input
                id="summary-collection-name"
                placeholder="Enter sumarry collection name"
                value={summaryCollectionName}
                onChange={(e) => setSummaryCollectionName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateCollectionOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCollection}>Create Collection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate API Key Dialog */}
      <Dialog open={isGenerateKeyOpen} onOpenChange={setIsGenerateKeyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate API Key</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {apiKey ? (
              <div className="grid gap-2">
                <Label htmlFor="api-key">Your API Key</Label>
                <div className="flex">
                  <Input
                    id="api-key"
                    value={apiKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Make sure to copy this key and store it securely. It won't be displayed again.
                </p>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                Click the button below to generate a new API key
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateKeyOpen(false)}>Close</Button>
            {!apiKey && <Button onClick={handleGenerateApiKey}>Generate Key</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="document-file">Select File</Label>
              <Input
                id="document-file"
                type="file"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadDocument}>Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isTestBotOpen} onOpenChange={setIsTestBotOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Test Your Document Bot</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-[400px]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-lg bg-muted">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isWidgetCodeOpen} onOpenChange={setIsWidgetCodeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Widget Embed Code</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Copy this code to embed the chat widget in your website:</Label>
              <div className="relative">
                <pre className="p-4 rounded-lg bg-muted font-mono text-sm">
                  {widgetCode}
                </pre>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    navigator.clipboard.writeText(widgetCode);
                    toast({
                      title: "Copied!",
                      description: "Widget code copied to clipboard"
                    });
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWidgetCodeOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Core;
