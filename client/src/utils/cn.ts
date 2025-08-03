  const cn = (...classNames: (string | undefined | null | false)[]) => {
    const combinedClasses = [...classNames].filter(Boolean).join(' ');
    return combinedClasses;
  };

  export default cn;