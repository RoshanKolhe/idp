import { Helmet } from 'react-helmet-async';
// sections
import FileTypeEditView from 'src/sections/fileType/view/fileType-edit-view';

// ----------------------------------------------------------------------

export default function FileTypeEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: File Type Edit</title>
      </Helmet>

      <FileTypeEditView />
    </>
  );
}
