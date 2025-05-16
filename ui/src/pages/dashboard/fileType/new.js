import { Helmet } from 'react-helmet-async';
// sections
import { FileTypeCreateView } from 'src/sections/fileType/view';

// ----------------------------------------------------------------------

export default function FileTypeCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new File Type</title>
      </Helmet>

      <FileTypeCreateView />
    </>
  );
}
