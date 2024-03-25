import Link from 'next/link';
import dynamic from 'next/dynamic';
const FourOFourSVG = dynamic(() => import('@nifty/client/components/404-img'), {
  ssr: false,
});

// todo lazy import svg
const NotFound = () => {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center px-6 bg-primary">
      <FourOFourSVG />
      <h1 className="text-primary mt-6 text-center text-3xl font-extrabold md:mt-8 md:text-4xl lg:mt-10 lg:text-5xl xl:mt-12 xl:text-6xl">
        Page not found
      </h1>
      <p className="text-tertiary mt-3 max-w-[80ch] text-center text-sm md:mt-4 lg:mt-5 lg:text-base xl:mt-6">
        The page you&apos;re looking for doesn&apos;t seem to exist, it might
        have been moved to another url or if you just wanted to see what our 404
        page looks like, well there you go, looks fancy right!
      </p>
      <Link
        href="/"
        className="mt-12 text-tertiary underline underline-offset-8 "
      >
        Go back to home page.
      </Link>
    </main>
  );
};

export default NotFound;
