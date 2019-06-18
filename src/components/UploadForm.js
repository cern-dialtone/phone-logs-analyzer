import React from 'react';
import { Form, TextArea } from 'semantic-ui-react';
export const UploadForm = props => {
  return (
    <Form className="upload" id="file">
      <input type="file" id="file-input" onChange={(e) => {
        /**
         * This part will read the file and fill the parent 'logs' state by handler
         * then it will tell onChange to change or not (if the file is correct) the panel (passing from UploadForm to Interpret)
         */
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onloadend = e => {
        props.handler({ logs: e.target.result });
        props.onChange(e.target.result);
      };
      reader.readAsText(e.target.files[0]);
    }
}} />
      <TextArea
        placeholder="Paste logs"
        onChange={() =>{ props.handler({ logs: document.getElementById('paste').value }); props.onChange(document.getElementById('paste').value); }}
        id="paste"
        style={{ marginTop: 50 }}
      />
    </Form>
  );
};
export default UploadForm;
