import nats, { Stan } from 'node-nats-streaming';

// we create this class so that we use it in index.ts file just like we use mongoose
// to avoid circular dependencies
class NatsWrapper {
  private _client?: Stan; //tell TS that this property might be undefined for some period of time.

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }
  connect(clusterId: string, cliendId: string, url: string) {
    this._client = nats.connect(clusterId, cliendId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
