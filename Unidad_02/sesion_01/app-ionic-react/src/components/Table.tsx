interface ContainerProps {}

const Table: React.FC<ContainerProps> = () => {
  return (
    <div>
      <strong>Ready to create an app?</strong>
      <p>
        Start with Ionic{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://ionicframework.com/docs/components"
        >
          UI Components
        </a>
      </p>
    </div>
  );
};

export default Table;
