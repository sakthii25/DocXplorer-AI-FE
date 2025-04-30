import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FolderPlus, Key, FileText, Upload, Bot, Code, Trash2, Circle, Copy} from "lucide-react";
import { toast } from "sonner"

const Home = () => {
  const navigate = useNavigate();
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [summaryCollectionName, setSummaryCollectionName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isCreated, setIsCreated] = useState(false);
  const [isWidgetCodeOpen, setIsWidgetCodeOpen] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/list-documents`,
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
    })
    .catch(error => console.error('Error:', error));
  },[])

  const handleCreateCollection = () => {
    if (!collectionName) {
      toast.error("Please enter a collection name");
      return;
    }
    let payload = {"collection_name": collectionName, "summary_collection_name": summaryCollectionName}
    fetch(`${BASE_URL}/create-collection`, 
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
    .then(response => response.json())
    .then(_ => 
      toast.success(`Collection "${collectionName}" created successfully!`)
    )
    .catch(error =>{
      toast.error(`Cant create  a Collection "${collectionName}" right now`)
      console.error("Error: ",error)
    })
    .finally(_ => {
      setIsCreateCollectionOpen(false);
      setIsCreated(true);
    })
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };       

  const handleUploadDocument = () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    let formData = new FormData();
    let json_str = {"collection_name" :  collectionName,"summary_collection_name" : summaryCollectionName}
    formData.append("file",selectedFile)
    formData.append("json_str",JSON.stringify(json_str))

    fetch(`${BASE_URL}/index-docs`,
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
        toast.success(`File "${selectedFile.name}" uploaded successfully!`)
      })
      .catch(error => {
        toast.error(`File "${selectedFile.name}" upload Failed!`)
        console.log("Error: " + error)
      })

    setSelectedFile(null);
    setIsUploadOpen(false);
  };

  const handleDeleteDocument = (id) => {
    
    let payload = {"id": id,"collection_name": collectionName,"summary_collection_name": summaryCollectionName}
    fetch(`${BASE_URL}/delete-document`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success("The document has been deleted successfully.")
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetCode);
    toast("Code copied to clipboard");
    setIsWidgetCodeOpen(false);
  };

  const widgetCode = `
  <link rel="stylesheet" href="https://sakthii25.github.io/DocXplorer-widget/dist/docxplorer-widget.css">
  <script src="https://sakthii25.github.io/DocXplorer-widget/dist/docxplorer-widget.js""></script>

  <script>
    window.initChatWidget({ elementId: 'chat-widget-container' });
  </script>

  <div id="chat-widget-container"></div>
  `;

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
            <p className="mb-4 text-muted-foreground">{isCreated ? "See your current active collections" : "Create a new collection to index your files."}</p>
            <Button onClick={() => setIsCreateCollectionOpen(true)}>{isCreated ? "Show Collection" : "Create Collection"}</Button>
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
            <Button onClick={() => navigate("/apikeys")}>Generate API Key</Button>
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
            <Button onClick={() => navigate("/test")}>Open Chat</Button>
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.id.substring(0,8)}</TableCell>
                      <TableCell>{doc.document_name}</TableCell>
                      <TableCell>{doc.document_size}</TableCell>
                      <TableCell>{doc.uploaded_date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
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
            <DialogTitle>{isCreated ? "Active Collections" : "Create New Collection"}</DialogTitle>
          </DialogHeader>
          {isCreated ? (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2 p-4 border rounded-lg shadow-sm">
                <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                <div>
                    <p className="font-medium">{collectionName}</p>
                    <p className="text-sm text-muted-foreground">{"Collection Name"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 border rounded-lg shadow-sm">
                <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                <div>
                    <p className="font-medium">{summaryCollectionName}</p>
                    <p className="text-sm text-muted-foreground">{"Summary Collection Name"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="collection-name">Collection Name</Label>
                <Input
                  id="collection-name"
                  placeholder="Enter collection name"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                />
                
                <Label htmlFor="summary-collection-name">Summary Collection Name</Label>
                <Input
                  id="summary-collection-name"
                  placeholder="Enter summary collection name"
                  value={summaryCollectionName}
                  onChange={(e) => setSummaryCollectionName(e.target.value)}
                />
              </div>
            </div>
          )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateCollectionOpen(false)}>
            {isCreated ? "Close" : "Cancel"}
          </Button>
          {!isCreated && (
            <Button onClick={handleCreateCollection}>Create Collection</Button>
          )}
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
      <Dialog open={isWidgetCodeOpen} onOpenChange={setIsWidgetCodeOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Widget Embed Code</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Copy this code to embed the chat widget in your website:</Label>
              <div className="relative rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-w-full">
                  <pre className="p-4 rounded-lg bg-muted font-mono text-sm overflow-x-auto">
                    {widgetCode}
                  </pre>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 flex items-center gap-1"
                  onClick={handleCopy}
                >
                  <Copy size={14} />
                  <span>Copy</span>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsWidgetCodeOpen(false)}}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
