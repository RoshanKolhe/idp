import { Helmet } from 'react-helmet-async';
// sections
import DocumentTypeEditView from 'src/sections/documentType/view/documentType-edit-view';

// ----------------------------------------------------------------------

export default function DocumentTypeEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: DocumentType Edit</title>
      </Helmet>

      <DocumentTypeEditView />
    </>
  );
}
