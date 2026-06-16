import { Helmet } from 'react-helmet-async';
import { TransactionDocumentsView } from 'src/sections/processInstance/transaction-documents/view';

export default function TransactionDocumentsPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Transaction Documents</title>
      </Helmet>
      <TransactionDocumentsView />
    </>
  );
}
