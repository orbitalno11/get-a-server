import { InterestedSubjectEntity } from "../../entity/member/interestedSubject.entity"
import { isNotEmpty } from "../../core/extension/CommonExtension"

class Subject {
    id: string
    title: string

    public static create(id: string, value: string): Subject {
        const subject = new Subject()
        subject.id = id
        subject.title = value
        return subject
    }

    getFirstSubject(subjectList: InterestedSubjectEntity[]): Subject | null {
        const rankOneSubject = subjectList.filter((item) => {
            return item.subjectRank === 1
        })
        return isNotEmpty(rankOneSubject) ? Subject.create(rankOneSubject[0].subject?.code, rankOneSubject[0].subject?.title) : null
    }
}

export default Subject