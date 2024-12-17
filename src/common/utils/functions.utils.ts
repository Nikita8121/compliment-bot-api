export const groupArray = <T>(array: T[], groupSize: number = 2): T[][] => {
  if (groupSize <= 0) {
    throw new Error('Group size must be greater than 0');
  }

  return array.reduce((result: T[][], item: T, index: number) => {
    const groupIndex = Math.floor(index / groupSize);
    
    if (index % groupSize === 0) {
      result[groupIndex] = [];
    }
    
    result[groupIndex].push(item);
    return result;
  }, []);
};
