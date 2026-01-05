interface LoaderProps {
  size?: 'sm' | 'md';
}

const Loader = ({ size = 'md' }: LoaderProps) => {
  return <span className={`loader loader--${size}`} aria-hidden="true" />;
};

export default Loader;
