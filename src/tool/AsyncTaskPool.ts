/* AsyncTaskPool - something similar to Python's `multiprocessing.Pool()`
 * (Generated by ChatGPT) */

export class AsyncTaskPool {
  private poolSize: number
  private currentTasks: number
  private taskQueue: (() => Promise<void>)[]
  private completedTasks: number // To track the number of completed tasks

  constructor(poolSize: number) {
    this.poolSize = poolSize
    this.currentTasks = 0
    this.taskQueue = []
    this.completedTasks = 0
  }

  private runNextTask() {
    if (this.currentTasks < this.poolSize && this.taskQueue.length > 0) {
      const task = this.taskQueue.shift()
      if (task) {
        this.currentTasks++
        task().then(() => {
          this.completedTasks++
        }).finally(() => {
          this.currentTasks--
          this.runNextTask()
        })
      }
    }
  }

  addTask(task: () => Promise<void>) {
    this.taskQueue.push(task)
    this.runNextTask()
  }

  async runAll(onProgress?: (completed: number, total: number) => void) {
    const totalTasks = this.taskQueue.length

    while (this.taskQueue.length > 0 || this.currentTasks > 0) {
      if (onProgress) {
        onProgress(this.completedTasks, totalTasks) // Report progress
      }
      await new Promise((resolve) => setTimeout(resolve, 100)) // Wait for all tasks to complete
    }

    if (onProgress) {
      onProgress(this.completedTasks, totalTasks)
    }
  }
}