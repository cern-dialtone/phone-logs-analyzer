import React from 'react';
import { Form, TextArea } from 'semantic-ui-react';
export const UploadForm = props => {
  return (
    <Form className="upload" id="file" onChange={props.onChange}>
      <input type="file" />
      <TextArea placeholder="Paste logs" id="paste" style={{ marginTop: 50 }} />
    </Form>
  );
};
export default UploadForm;
