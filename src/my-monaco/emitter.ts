import mitt from "mitt";

type MonacoEvents = {
  changevalue: {
    domElement: HTMLElement;
    message: string | null;
    value: string;
  };
};

const monacoEmitter = mitt<MonacoEvents>();

export default monacoEmitter;
