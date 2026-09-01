import type { Mission } from "./types"

/**
 * Cases no ar. Recorte full-stack / engenharia — não vitrine de BI.
 */
export const missions: readonly Mission[] = [
  {
    id: "epi-detect",
    code: "M-02",
    name: "EPI Detect",
    year: 2026,
    status: "orbital",
    summary: {
      pt: "Monitor de colete de segurança em tempo real: YOLO Pose, regra HSV no torso e um painel web com stream MJPEG.",
      en: "Real-time safety-vest monitor: YOLO Pose, HSV torso rules and a web dashboard with an MJPEG stream.",
      es: "Monitor de chaleco de seguridad en tiempo real: YOLO Pose, reglas HSV en el torso y un panel web con stream MJPEG.",
    },
    briefing: {
      pt: [
        "Localiza pessoas com YOLOv8 Pose, recorta o torso e procura amarelo-limão ou laranja fluorescente. Só marca colete se a cor cobre uma área grande nos dois lados do peito — faixas de uniforme cinza não passam.",
        "Captura, inferência e JPEG rodam em threads separadas. O painel Flask não espera o modelo. Azul = colete; laranja = ausência ou uso insuficiente.",
        "Protótipo de visão computacional: apoia um operador. Não substitui inspeção de SST. A demo no ar roda um loop de clipes de stock (Mixkit) com colete fluorescente. No painel dá para apontar uma câmera RTSP; upload de arquivo está desligado.",
      ],
      en: [
        "Finds people with YOLOv8 Pose, crops the torso and looks for fluorescent yellow-green or orange. A vest only counts if the colour covers a large area on both sides of the chest — grey uniforms with reflective tape do not.",
        "Capture, inference and JPEG run on separate threads so the Flask dashboard never waits on the model. Blue = vest; orange = missing or insufficient use.",
        "Computer-vision prototype: it supports an operator. It does not replace a safety inspection. The live demo loops Mixkit stock clips of fluorescent vests. The dashboard accepts an RTSP camera; file upload is off.",
      ],
      es: [
        "Localiza personas con YOLOv8 Pose, recorta el torso y busca amarillo lima o naranja fluorescente. El chaleco solo cuenta si el color cubre un área grande en ambos lados del pecho — un uniforme gris con cintas no pasa.",
        "Captura, inferencia y JPEG corren en hilos separados. El panel Flask no espera al modelo. Azul = chaleco; naranja = ausencia o uso insuficiente.",
        "Prototipo de visión: apoya a un operador. No sustituye una inspección de SST. La demo en vivo recorre clips de Mixkit con chaleco fluorescente. El panel acepta una cámara RTSP; la subida de archivo está desactivada.",
      ],
    },
    stack: ["Python", "Flask", "YOLOv8 Pose", "OpenCV", "PyTorch"],
    links: {
      demo: "http://178.105.63.20/epi-detect/",
      repo: "https://github.com/HenriqueErdei/EPI-Detect",
    },
    metrics: [
      {
        label: { pt: "Entrada", en: "Input", es: "Entrada" },
        value: "Webcam · MP4 · RTSP",
      },
      {
        label: { pt: "Modelo", en: "Model", es: "Modelo" },
        value: "YOLOv8n-Pose + HSV",
      },
      {
        label: { pt: "Regra", en: "Rule", es: "Regla" },
        value: "Área + dois lados + span",
      },
    ],
    image: "/missions/epi-detect.svg",
    imageAlt: {
      pt: "Diagrama do pipeline: captura, YOLO Pose, HSV no torso e painel web.",
      en: "Pipeline diagram: capture, YOLO Pose, HSV on the torso and the web dashboard.",
      es: "Diagrama del pipeline: captura, YOLO Pose, HSV en el torso y el panel web.",
    },
  },
  {
    id: "fall-detect",
    code: "M-01",
    name: "Fall Detect",
    year: 2026,
    status: "orbital",
    summary: {
      pt: "Detector de quedas em tempo real: YOLO Pose, regras geométricas e um painel web com stream MJPEG.",
      en: "Real-time fall detector: YOLO Pose, geometric rules and a web dashboard with an MJPEG stream.",
      es: "Detector de caídas en tiempo real: YOLO Pose, reglas geométricas y un panel web con stream MJPEG.",
    },
    briefing: {
      pt: [
        "Lê o loop de demo ou uma câmera RTSP. Localiza pessoas com YOLOv8 Pose e confirma queda só depois de vários frames da mesma pessoa — tronco deitado, box mais larga que alta, pose recolhida ou queda de altura em relação à mediana em pé.",
        "Captura, inferência e JPEG rodam em threads separadas. O painel Flask não espera o modelo. Azul = em pé; laranja = queda confirmada.",
        "Protótipo de visão computacional: apoia um operador. Não dispara socorro sozinho e não substitui supervisão humana. A demo no ar roda em loop demo1 e demo2. No painel dá para apontar uma câmera RTSP; upload de arquivo está desligado.",
      ],
      en: [
        "Reads the demo loop or an RTSP camera. Finds people with YOLOv8 Pose and only confirms a fall after several frames of the same person — torso down, a box wider than tall, a tucked pose, or a drop in height versus the standing median.",
        "Capture, inference and JPEG run on separate threads so the Flask dashboard never waits on the model. Blue = standing; orange = confirmed fall.",
        "Computer-vision prototype: it supports an operator. It does not dispatch help on its own. The live demo loops demo1 and demo2. The dashboard accepts an RTSP camera; file upload is off.",
      ],
      es: [
        "Lee el bucle de demo o una cámara RTSP. Localiza personas con YOLOv8 Pose y solo confirma la caída tras varios frames de la misma persona — tronco recostado, box más ancha que alta, pose recogida o caída de altura frente a la mediana de pie.",
        "Captura, inferencia y JPEG corren en hilos separados. El panel Flask no espera al modelo. Azul = de pie; naranja = caída confirmada.",
        "Prototipo de visión: apoya a un operador. No dispara socorro solo. La demo en vivo recorre en bucle demo1 y demo2. El panel acepta una cámara RTSP; la subida de archivo está desactivada."
      ],
    },
    stack: ["Python", "Flask", "YOLOv8 Pose", "OpenCV", "PyTorch"],
    links: {
      demo: "http://178.105.63.20/fall-detect/",
      repo: "https://github.com/HenriqueErdei/Fall-Detect",
    },
    metrics: [
      {
        label: { pt: "Entrada", en: "Input", es: "Entrada" },
        value: "Webcam · MP4 · RTSP",
      },
      {
        label: { pt: "Modelo", en: "Model", es: "Modelo" },
        value: "YOLOv8n-Pose",
      },
      {
        label: { pt: "Confirmação", en: "Confirm", es: "Confirmación" },
        value: "5 / 8 frames",
      },
    ],
    image: "/missions/fall-detect.svg",
    imageAlt: {
      pt: "Diagrama do pipeline: captura, inferência YOLO Pose e painel web.",
      en: "Pipeline diagram: capture, YOLO Pose inference and the web dashboard.",
      es: "Diagrama del pipeline: captura, inferencia YOLO Pose y el panel web.",
    },
  },
]
