import * as monaco from "monaco-editor";
import emitter from "./emitter";
import myAjv from "./my-ajv";

import { validateSchema } from '@joehecnweb/cedar-wasm'

// import { addFuns } from "./add-funs";

const _schemas: any = [];
const _removeSchema = (id: string) => {
  const index = _schemas.findIndex((item: any) => item.uri === id);
  if (index > -1) {
    _schemas.splice(index, 1);
  }
};
const _getSchemas = (item: any) => {
  _schemas.push(item);
  return _schemas;
};

// const addFun = (func: string, funcFilename: string) => {
//   monaco.languages.typescript.typescriptDefaults.addExtraLib(
//     func,
//     funcFilename
//   );
// };

const validateJson = (value: string) => {
  try {
    // JSON.parse(value);
    const res = validateSchema(value);
    const result = JSON.parse(res);
    if (result.code !== 0) {
      return {
        checked: false,
        message: result.message,
      };
    } else {
      return {
        checked: true,
        message: "",
      };
    }
  } catch (error: any) {
    return {
      checked: false,
      message: error.message || 'JSON 格式错误',
    };
  }
}

class MyMonaco {
  // 静态属性
  // static prop: string

  // 静态方法
  static getMarkers(owner: string, id: string) {
    const option = {
      owner,
      resource: monaco.Uri.parse(id),
    };
    return monaco.editor.getModelMarkers(option);
  }
  // 在离开页面之前重置 monaco
  // static reset() {}

  domElement: HTMLElement;
  // option: monaco.editor.IStandaloneEditorConstructionOptions
  instance: monaco.editor.IStandaloneCodeEditor | null = null;
  // modelUri: monaco.Uri

  _value = "";

  // 实例构造函数
  constructor(domElement: HTMLElement) {
    // this.setInstance(domElement, option, jsonOption)
    this.domElement = domElement;
  }

  _checkSchemaValue(value: string | undefined, domElement: HTMLElement) {
    if (value === undefined) return;

    const { checked, message } = myAjv.validateSchema(value);

    if (checked) {
      if (value !== this._value) {
        // console.log('--- value')
        // console.log(value)
        // console.log('--- this._value')
        // console.log(this._value)
        emitter.emit("changevalue", { domElement, message: "", value });
      } else {
        // console.log('emit change value = ""')
        emitter.emit("changevalue", { domElement, message: "", value: "" });
      }
    } else if (message) {
      // console.log('emit change message')
      emitter.emit("changevalue", { domElement, message, value: "" });
    }

    this._value = value;
  }

  _checkJsonValue(
    schema: any,
    value: string | undefined,
    domElement: HTMLElement
  ) {
    if (value === undefined) return;

    const { checked, message } = validateJson(value);

    if (checked) {
      if (value !== this._value) {
        // console.log('--- value')
        // console.log(value)
        // console.log('--- this._value')
        // console.log(this._value)
        emitter.emit("changevalue", { domElement, message: "", value });
      } else {
        // console.log('emit change value = ""')
        emitter.emit("changevalue", { domElement, message: "", value: "" });
      }
    } else if (message) {
      // console.log('emit change message')
      emitter.emit("changevalue", { domElement, message, value });
    }

    this._value = value;
  }

  handleSchema(
    option: monaco.editor.IStandaloneEditorConstructionOptions,
    value: string,
    id: string
  ) {
    const modelUri = monaco.Uri.parse(id); // a made up unique URI for our model

    const model = monaco.editor.getModel(modelUri);
    if (model) {
      // console.log('已经有 model')
      // console.log(this.instance)
      option.model = model;
    } else {
      // console.log('新建 model')
      option.model = monaco.editor.createModel(value, "json", modelUri);
    }

    // configure the JSON language support with schemas and schema associations
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: _getSchemas({
        uri: "http://json-schema.org/draft-07/schema", // id of the first schema
        fileMatch: [modelUri.toString()], // associate with our model
      }),
    });

    this.instance = monaco.editor.create(this.domElement, option);

    this.instance.onDidChangeModelContent(() => {
      // console.log('---- onDidChangeModelContent')
      const _value = this.instance!.getValue();
      this._checkSchemaValue(_value, this.domElement);
    });

    // 主动触发一次
    this.instance.setValue(value);
    // this._checkSchemaValue(value, this.domElement)
  }

  handleJson(
    option: monaco.editor.IStandaloneEditorConstructionOptions,
    jsonOption: any,
    value: string
  ) {
    // isSchema id: 指令文件
    // id schema: 设备文件
    const { isSchema, id, schema } = jsonOption;
    if (isSchema) {
      this.handleSchema(option, value, id);
      return;
    }

    // json
    if (id) _removeSchema(id);

    const needCheckValue = !option.readOnly;

    if (needCheckValue && id && schema) {
      const modelUri = monaco.Uri.parse(id); // a made up unique URI for our model

      const model = monaco.editor.getModel(modelUri);
      if (model) {
        model.dispose();
        // console.log('isDisposed:', model.isDisposed())
      }

      // console.log('新建 model')
      option.model = monaco.editor.createModel(value, "json", modelUri);

      // configure the JSON language support with schemas and schema associations
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: _getSchemas({
          uri: id, // id of the first schema
          fileMatch: [modelUri.toString()], // associate with our model
          schema,
        }),
      });
    }

    if (this.instance) {
      this.instance.updateOptions(option);
    } else {
      this.instance = monaco.editor.create(this.domElement, option);

      this.instance.onDidChangeModelContent(() => {
        const _value = this.instance!.getValue();
        if (needCheckValue) {
          this._checkJsonValue(schema, _value, this.domElement);
        } else {
          emitter.emit("changevalue", {
            domElement: this.domElement,
            message: "",
            value: _value,
          });
        }
      });
    }

    if (needCheckValue) {
      // 主动触发一次
      this._checkJsonValue(schema, value, this.domElement);
    }
  }

  handleTypescript(option: monaco.editor.IStandaloneEditorConstructionOptions) {
    this.instance = monaco.editor.create(this.domElement, option);

    // addFun(
    //   "declare function T_M_SIGNED(data: number[], skip: number): number;",
    //   "ME_OPEN_SIGNED"
    // );
    // addFun(
    //   "declare function T_M_LONG_CD_AB(data: number[], skip: number): number;",
    //   "ME_OPEN_LONG_CD_AB"
    // );
    // addFun(
    //   "declare function T_M_LONG_AB_CD(data: number[], skip: number): number;",
    //   "ME_OPEN_LONG_AB_CD"
    // );
    // addFun(
    //   "declare function T_M_FLOAT_CD_AB(data: number[], skip: number): number;",
    //   "ME_OPEN_FLOAT_CD_AB"
    // );
    // addFun(
    //   "declare function T_M_FLOAT_CD_AB_R(data: number): number[];",
    //   "ME_OPEN_FLOAT_CD_AB_R"
    // );

    // // addFun('declare function T_M_FLOAT_64_BE(data: number[], skip: number): number;', 'ME_OPEN_FLOAT_64_BE')
    // addFun(
    //   "declare function T_M_INT_16_LE(data: number[], skip: number): number;",
    //   "ME_OPEN_INT_16_LE"
    // );
    // addFun(
    //   "declare function T_M_INT_32_LE(data: number[], skip: number): number;",
    //   "ME_OPEN_INT_32_LE"
    // );
    // // addFun('declare function T_M_INT_64_LE(data: number[], skip: number): number;', 'ME_OPEN_INT_64_LE')

    // addFun(
    //   "declare function T_M_FLOAT_AB_CD(data: number[], skip: number): number;",
    //   "ME_OPEN_FLOAT_AB_CD"
    // );
    // addFun(
    //   "declare function T_M_FLOAT_AB_CD_R(data: number): number[];",
    //   "ME_OPEN_FLOAT_AB_CD_R"
    // );
    // // addFun('declare function T_M_FLOAT_64_LE(data: number[], skip: number): number;', 'ME_OPEN_FLOAT_64_LE')
    // addFun(
    //   "declare function T_M_UNINT_16_BE(data: number[], skip: number): number;",
    //   "ME_OPEN_UNINT_16_BE"
    // );
    // addFun(
    //   "declare function T_M_UNLONG_CD_AB(data: number[], skip: number): number;",
    //   "ME_OPEN_UNLONG_CD_AB"
    // );

    // // addFun('declare function T_M_UNINT_64_BE(data: number[], skip: number): number;', 'ME_OPEN_UNINT_64_BE')
    // addFun(
    //   "declare function T_M_UNINT_16_LE(data: number[], skip: number): number;",
    //   "ME_OPEN_UNINT_16_LE"
    // );
    // addFun(
    //   "declare function T_M_UNINT_32_LE(data: number[], skip: number): number;",
    //   "ME_OPEN_UNINT_32_LE"
    // );
    // // addFun('declare function T_M_UNINT_64_LE(data: number[], skip: number): number;', 'ME_OPEN_UNINT_64_LE')

    // addFun(
    //   "declare function T_H_GET_VALIDATE_CODE(customID: string): string;",
    //   "ME_OPEN_GET_VALIDATE_CODE"
    // );

    // addFun(
    //   "declare function T_U_XML_TO_JSON(xml: string, options?: object): any;",
    //   "ME_OPEN_XML_TO_JSON"
    // );

    // addFuns(monaco);

    this.instance.onDidChangeModelContent(() => {
      const value = this.instance!.getValue();
      emitter.emit("changevalue", {
        domElement: this.domElement,
        message: "",
        value,
      });
    });
  }

  setValue(value: string) {
    this._value = value;
    this.instance?.setValue(value);
  }

  setInstance(
    option: monaco.editor.IStandaloneEditorConstructionOptions,
    _jsonOption: any
  ) {
    const { language, value } = option as any;

    if (language === "json") {
      this.handleJson(option, _jsonOption, value);
    } else if (language === "typescript") {
      this.handleTypescript(option);
    }
  }

  dispose() {
    this.instance?.dispose();
    this.instance = null;
  }
}

export default MyMonaco;
