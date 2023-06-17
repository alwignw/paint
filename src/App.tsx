import { useState ,useRef } from "react";
import "./App.css";
import Swal from 'sweetalert2'
import "sweetalert2/src/sweetalert2.scss";
import { ButtonDraw } from "./component/atoms/button.draw.tsx";
import { InputColor } from "./component/atoms/input.color.tsx";
import {InputImage } from "./component/atoms/input.image.tsx";

import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { FiCircle } from "react-icons/fi";
import { BiUndo, BiRedo } from "react-icons/bi";

import {
  MdOutlineRectangle,
  MdLayersClear,
  MdDraw,
} from "react-icons/md";
import { AiOutlineLine, AiOutlineDelete } from "react-icons/ai";
import { RxText } from "react-icons/rx";
import { IoIosColorFilter } from "react-icons/io";
import { BsTriangle } from "react-icons/bs";
import { fabric } from "fabric";

import { toPng } from 'html-to-image';

const App = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [bgColor, setBgColor] = useState("transparent");
  const [modeDraw, setModeDraw] = useState(true);
  const [history, setHistory] = useState([true]);
  const elementRef = useRef<HTMLDivElement | null | any>(null);

  const htmlToImageConvert = () => {
    toPng(elementRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };



  const validationDraw = (draw: boolean): boolean => {
    if (!draw) {
      Swal.fire({
        title: "Drawing mode is on",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
      return true;
    }
    return false;
  };


  const onEvent = async (type: string) => {
    await editor.setFillColor(bgColor);
    if (validationDraw(modeDraw)) return;

    if (type.includes("Text")) {  
      editor.updateText("");
      editor[type]("Text Here...");
      return;
    }
 
    editor[type]();
  };

  const triangle = () => {
    if (validationDraw(modeDraw)) return;
    const canvas = new fabric.Triangle({
      top: 100,
      left: 100,
      width: 100,
      height: 100,
      fill: bgColor,
      stroke: "black",
      strokeWidth: 1,
    });
    editor?.canvas.add(canvas);
  };

  const undo = () => {
    let histo = history;
    if (editor.canvas._objects.length > 0) {
      histo.push(editor.canvas._objects.pop());
    }
    setHistory(histo);
    editor.canvas.renderAll();
  };

  const redo = () => {
    if (history.length > 0) {
      editor.canvas.add(history.pop());
    }
  };

  const clear = () => {
    editor.canvas._objects.splice(0, editor.canvas._objects.length);
    history.splice(0, history.length);
    editor.canvas.renderAll();
  };

  const toggleDraw = () => {
    editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
    setModeDraw(!editor.canvas.isDrawingMode);
  };

  const insertImg = (e:any) => {
    new fabric.Canvas("canvas");
    const reader = new FileReader();
    reader.onload = function (ea: any) {
      const image = new Image();
      image.src = ea.target.result;
      image.onload = function () {
        const img = new fabric.Image(image);
        img.set({
          left: 100,
          top: 60,
        });
        img.scaleToWidth(200);
        editor.canvas.add(img);
      };
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  return (
    <div className="containerDrawing">
      <div className="sidebar">
        <div>
          <ButtonDraw
            callback={() => {
              onEvent("addCircle");
            }}
          >
            <FiCircle />
          </ButtonDraw>
          <ButtonDraw
            callback={() => {
              onEvent("addRectangle");
            }}
          >
            <MdOutlineRectangle />
          </ButtonDraw>
        </div>
        <div>
          <ButtonDraw
            callback={() => {
              onEvent("addLine");
            }}
          >
            <AiOutlineLine />
          </ButtonDraw>
          <ButtonDraw
            callback={() => {
              onEvent("addText");
            }}
          >
            <RxText />
          </ButtonDraw>
        </div>

        <div>
          <ButtonDraw
            callback={() => {
              toggleDraw();
            }}
            className={!modeDraw ? "active-button" : ""}
          >
            <MdDraw />
          </ButtonDraw>
          <ButtonDraw
            callback={() => {
              triangle();
            }}
          >
            <BsTriangle />
          </ButtonDraw>
        </div>

        <div className="line"></div>

        <div>
          <InputColor
            className="btn-colors"
            name="bgColor"
            id="bgColor"
            value={bgColor}
            callback={(e) => {
              editor.setFillColor(e.target.value);
              setBgColor(e.target.value);
            
            }}
          >
            <IoIosColorFilter />
          </InputColor>
        </div>

        <div className="line"></div>
    
        <InputImage className="custom-file-input"   name="colors" callback={(e)=>{insertImg(e)}}>
        </InputImage>      

        <div className="line"></div>
        <div>
          <button onClick={undo}>
            <BiUndo></BiUndo>{" "}
          </button>
          <button onClick={redo}>
            <BiRedo></BiRedo>{" "}
          </button>
        </div>

        <div>
          <button onClick={() => onEvent("deleteSelected")}>
            <AiOutlineDelete></AiOutlineDelete>{" "}
          </button>
          <button onClick={() => clear()}>
            <MdLayersClear></MdLayersClear>{" "}
          </button>
        </div>
        <div className="line"></div>
        <div>
            <button onClick={htmlToImageConvert}>Export Image</button>
        </div>
    
      </div>
      <div className="mainDraw" ref={elementRef}>
        <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        <div className="footer">
          <p>&copy; 2023 Alwi Gnw. All rights reserved.</p>
        </div>
      </div>
   
    </div>
  );
};

export default App;
