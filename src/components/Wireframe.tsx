import React, { useState, useRef } from 'react';
import { Download, Loader2, Plus, Trash2, Save } from 'lucide-react';
import { toPng } from 'html-to-image';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import { WireframeElement } from '../App';
import 'react-resizable/css/styles.css';

interface WireframeProps {
  elements: WireframeElement[];
  isLoading: boolean;
}

export const Wireframe: React.FC<WireframeProps> = ({ elements, isLoading }) => {
  const [wireframeElements, setWireframeElements] = useState<WireframeElement[]>(elements);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showElementPanel, setShowElementPanel] = useState(false);
  const wireframeRef = useRef<HTMLDivElement>(null);

  const handleDrag = (id: string, e: any, data: { x: number; y: number }) => {
    setWireframeElements(prev => 
      prev.map(el => 
        el.id === id ? { ...el, x: data.x, y: data.y } : el
      )
    );
  };

  const handleResize = (id: string, e: any, { size }: { size: { width: number; height: number } }) => {
    setWireframeElements(prev => 
      prev.map(el => 
        el.id === id ? { ...el, width: size.width, height: size.height } : el
      )
    );
  };

  const handleSelect = (id: string) => {
    setSelectedElement(id === selectedElement ? null : id);
  };

  const handleDelete = (id: string) => {
    setWireframeElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const addElement = (type: WireframeElement['type']) => {
    const newElement: WireframeElement = {
      id: `${type}-${Date.now()}`,
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      x: 100,
      y: 100,
      width: 300,
      height: type === 'header' || type === 'footer' ? 100 : type === 'hero' ? 400 : 200,
      content: `New ${type} content`
    };
    
    setWireframeElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
    setShowElementPanel(false);
  };

  const updateElementContent = (id: string, content: string) => {
    setWireframeElements(prev => 
      prev.map(el => 
        el.id === id ? { ...el, content } : el
      )
    );
  };

  const downloadAsPng = async () => {
    if (wireframeRef.current) {
      try {
        const dataUrl = await toPng(wireframeRef.current, { quality: 0.95 });
        
        // Create a link and trigger download
        const link = document.createElement('a');
        link.download = 'website-wireframe.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  const renderElementControls = () => {
    if (!selectedElement) return null;
    
    const element = wireframeElements.find(el => el.id === selectedElement);
    if (!element) return null;
    
    return (
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Edit Element: {element.label}</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={element.label}
              onChange={(e) => {
                setWireframeElements(prev => 
                  prev.map(el => 
                    el.id === selectedElement ? { ...el, label: e.target.value } : el
                  )
                );
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              rows={3}
              value={element.content || ''}
              onChange={(e) => updateElementContent(selectedElement, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleDelete(selectedElement)}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto text-center">
        <Loader2 className="animate-spin h-8 w-8 mx-auto text-blue-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Generating wireframe...</h2>
        <p className="text-gray-600 mt-2">
          We're creating a wireframe based on your information architecture.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Website Wireframe</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowElementPanel(!showElementPanel)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            <Plus size={18} />
            Add Element
          </button>
          <button
            onClick={downloadAsPng}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            <Download size={18} />
            Download as PNG
          </button>
        </div>
      </div>
      
      {showElementPanel && (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Element</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <button
              onClick={() => addElement('header')}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-gray-700"
            >
              Header
            </button>
            <button
              onClick={() => addElement('navigation')}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-gray-700"
            >
              Navigation
            </button>
            <button
              onClick={() => addElement('hero')}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-gray-700"
            >
              Hero
            </button>
            <button
              onClick={() => addElement('section')}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-gray-700"
            >
              Section
            </button>
            <button
              onClick={() => addElement('card')}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-gray-700"
            >
              Card
            </button>
            <button
              onClick={() => addElement('form')}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-gray-700"
            >
              Form
            </button>
            <button
              onClick={() => addElement('text')}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-gray-700"
            >
              Text
            </button>
            <button
              onClick={() => addElement('image')}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-gray-700"
            >
              Image
            </button>
            <button
              onClick={() => addElement('button')}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-gray-700"
            >
              Button
            </button>
            <button
              onClick={() => addElement('footer')}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-gray-700"
            >
              Footer
            </button>
          </div>
        </div>
      )}
      
      {renderElementControls()}
      
      <div className="border border-gray-300 rounded-lg overflow-auto bg-gray-50" style={{ height: '800px' }}>
        <div 
          ref={wireframeRef}
          className="relative bg-white" 
          style={{ width: '1200px', height: '2000px' }}
        >
          {wireframeElements.map((element) => (
            <Draggable
              key={element.id}
              handle=".handle"
              defaultPosition={{ x: element.x, y: element.y }}
              position={{ x: element.x, y: element.y }}
              onStop={(e, data) => handleDrag(element.id, e, data)}
              bounds="parent"
            >
              <div className="absolute">
                <Resizable
                  width={element.width}
                  height={element.height}
                  onResize={(e, data) => handleResize(element.id, e, data)}
                  handle={
                    <div className="absolute bottom-right w-4 h-4 bg-blue-500 rounded-br-md cursor-se-resize" />
                  }
                >
                  <div 
                    className={`border-2 ${selectedElement === element.id ? 'border-blue-500' : 'border-gray-300'} bg-white rounded-md overflow-hidden`}
                    style={{ width: element.width, height: element.height }}
                    onClick={() => handleSelect(element.id)}
                  >
                    <div className="handle bg-gray-100 border-b border-gray-300 px-3 py-1 flex justify-between items-center cursor-move">
                      <span className="text-xs font-medium text-gray-700">{element.label}</span>
                      <span className="text-xs text-gray-500">{element.type}</span>
                    </div>
                    <div className="p-2 text-sm text-gray-600 h-[calc(100%-28px)] overflow-auto">
                      {element.content}
                    </div>
                  </div>
                </Resizable>
              </div>
            </Draggable>
          ))}
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Wireframe Instructions</h3>
        <p className="text-blue-700 mb-3">
          This wireframe is fully interactive. You can:
        </p>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>Drag elements to reposition them</li>
          <li>Resize elements by dragging the bottom-right corner</li>
          <li>Click on an element to select it and edit its properties</li>
          <li>Add new elements using the "Add Element" button</li>
          <li>Delete selected elements</li>
          <li>Download the wireframe as a PNG image</li>
        </ul>
      </div>
    </div>
  );
};