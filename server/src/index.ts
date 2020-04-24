import cluster from 'cluster';
import os from 'os';

import MainServerApp from './controllers';
class Cluster {
  private cpus: number;
  private cluster: typeof cluster;
  constructor() {
    this.cluster = cluster;
    this.cpus = os.cpus().length;
    this.createCluster();
  }
  private createCluster(): void {
    if (this.cluster.isMaster) {
      console.log(`Master process ${process.pid} running`);
      for (let index = 0; index < this.cpus; index++) {
        this.cluster.fork();
      }
    } else {
      console.log(`Worker process ${process.pid} running`);
      new MainServerApp();
    }
  }
}

((): void => {
  new Cluster();
})();
