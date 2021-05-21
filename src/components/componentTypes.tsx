
export interface SearchPaperInterface {
      title: string,
      description: string,
      questionUrl: string[],
      answerUrl: string[],
      downloads: string,
      id: string,
      cost: string,
      currency: string,
      author: string,
      year: string

}

export interface savedPaperInterface {
      title: string,
      description: string,
      questionUrl: string[],
      answerUrl: string[],
      id: string,
      author: string
}

export interface userInterface {
      name: string,
      tel: string,
      validate: `pending` | true | false,
      model: string,
      uuid: string,
      osVersion: string,
      deviceName: string | undefined
}


export interface UploadersTotalDownloads {
      tel: string,
      cost: string,
      currency: string,
      year: string,
      month: string,
      date: string
}

export interface localPendingPapers extends SearchPaperInterface {
      ref: string
}