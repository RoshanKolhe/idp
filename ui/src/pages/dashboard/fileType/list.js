import { Helmet } from 'react-helmet-async';
// sections
import { FileTypeListView } from 'src/sections/fileType/view';

// ----------------------------------------------------------------------

export default function FileTypeListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: File Type List</title>
      </Helmet>

      <FileTypeListView />
    </>
  );
}
