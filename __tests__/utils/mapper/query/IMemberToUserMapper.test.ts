import UserRole from "../../../../core/constant/UserRole"
import User from "../../../../models/common/User"
import IMemberToUserMapper from "../../../../utils/mapper/query/IMemberToUser"

describe("Test IMemberToUserMapper", () => {
    test("#1 map admin success", () => {
        const inputValue = {
            member_id: "test",
            username: "test",
            email: "test@mail.test",
            role_id: 0
        }

        const expectedValue: User = {
            id: "test",
            username: "test",
            email: "test@mail.test",
            role: UserRole.ADMIN
        }

        const actualValue = IMemberToUserMapper(inputValue)

        expect(actualValue).toEqual(expectedValue)
    })

    test("#2 map learner success", () => {
        const inputValue = {
            member_id: "test",
            username: "test",
            email: "test@mail.test",
            role_id: 1
        }

        const expectedValue: User = {
            id: "test",
            username: "test",
            email: "test@mail.test",
            role: UserRole.LEARNER
        }

        const actualValue = IMemberToUserMapper(inputValue)

        expect(actualValue).toEqual(expectedValue)
    })

    test("#3 map tutor success", () => {
        const inputValue = {
            member_id: "test",
            username: "test",
            email: "test@mail.test",
            role_id: 2
        }

        const expectedValue: User = {
            id: "test",
            username: "test",
            email: "test@mail.test",
            role: UserRole.TUTOR
        }

        const actualValue = IMemberToUserMapper(inputValue)

        expect(actualValue).toEqual(expectedValue)
    })

    test("#4 map tutor-learner success", () => {
        const inputValue = {
            member_id: "test",
            username: "test",
            email: "test@mail.test",
            role_id: 3
        }

        const expectedValue: User = {
            id: "test",
            username: "test",
            email: "test@mail.test",
            role: UserRole.TUTOR_LEARNER
        }

        const actualValue = IMemberToUserMapper(inputValue)

        expect(actualValue).toEqual(expectedValue)
    })

    test("#5 map visitor success", () => {
        const inputValue = {
            member_id: "test",
            username: "test",
            email: "test@mail.test",
            role_id: 5
        }

        const expectedValue: User = {
            id: "test",
            username: "test",
            email: "test@mail.test",
            role: UserRole.VISITOR
        }

        const actualValue = IMemberToUserMapper(inputValue)

        expect(actualValue).toEqual(expectedValue)
    })

})