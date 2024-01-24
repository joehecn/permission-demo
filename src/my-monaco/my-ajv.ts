import Ajv from "ajv";

const ajv = new Ajv({
  strict: true,
});

/*
{
  "type": "object",
  "properties": {
    "foo": {"type": "integer"}
  },
  "required": ["foo"],
  "additionalProperties": false
}
*/

const _filterSchemaErr = (message: string) => {
  console.log("-- ajv filter error:", message);

  if (message.includes("strict mode: ")) {
    return { checked: false, message: message.replace("strict mode: ", "") };
  } else if (message.includes("can't resolve reference")) {
    return { checked: false, message };
  }

  return { checked: false, message: null };
};

const _filterJsonErr = (message: string) => {
  // console.log('-- ajv filter error:', message)
  return { checked: false, message };
};

const validateSchema = (value: string) => {
  // console.log('-- ajv validate schema')
  try {
    const schema = JSON.parse(value);
    ajv.compile(schema);
    return { checked: true, message: null };
  } catch (error: any) {
    return _filterSchemaErr(error.message);
  }
};

const validateJson = (schema: any, value: string) => {
  // console.log('-- ajv validate json')
  try {
    const validate = ajv.compile(schema);

    const data = JSON.parse(value);
    const valid = validate(data);

    if (!valid) {
      const errors = validate.errors as any[];
      console.log("-- ajv validate json error:");
      console.log(errors);
      const message = errors[0].message;
      return { checked: false, message };
    }

    return { checked: true, message: null };
  } catch (error: any) {
    return _filterJsonErr(error.message);
  }
};

export default {
  validateSchema,
  validateJson,
};
