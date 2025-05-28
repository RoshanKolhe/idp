import { Helmet } from 'react-helmet-async';
// sections
import DocumentTypeView from 'src/sections/documentType/view/documentType-view';

// ----------------------------------------------------------------------

export default function DocumentTypeViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: DocumentType View</title>
      </Helmet>

      <DocumentTypeView />
    </>
  );
}
