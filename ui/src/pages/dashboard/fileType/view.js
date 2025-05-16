import { Helmet } from 'react-helmet-async';
// sections
import FileTypeView from 'src/sections/fileType/view/fileType-view';

// ----------------------------------------------------------------------

export default function FileTypeViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: File Type View</title>
      </Helmet>

      <FileTypeView />
    </>
  );
}
