import React from 'react';
import { Form, TextArea } from 'semantic-ui-react';
export const UploadForm = props => {
  return (
    <Form className="upload" id="file">
      <input type="file" id="file-input" onChange={props.onChange} />
      <TextArea
        placeholder="Paste logs"
        onChange={props.onChange}
        id="paste"
        style={{ marginTop: 50 }}
      />
    </Form>
  );
};
export default UploadForm;
