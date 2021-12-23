//fake natsWrapper to trick the test
export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),

    // publish: (subject: string, data: string, callback: () => void) => {
    //   callback(); // we call it right away so that the promise in the base-listener get resolved
  },
};

// mock function is to keep track of how many times a function gets called
// and how many arguments it's provided
