import { Helmet } from 'react-helmet-async';
// sections
import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title> HomePage: IDP</title>
      </Helmet>

      <HomeView />
    </>
  );
}
