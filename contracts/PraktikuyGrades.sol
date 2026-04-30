// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PraktikuyGrades is Ownable {
    // Event emitted when a grade is recorded
    event GradeRecorded(string pengumpulanId, address indexed student, uint256 grade, string classId);

    // Structure to hold grade info
    struct Grade {
        address student;
        uint256 grade;
        string classId;
        uint256 timestamp;
        bool exists;
    }

    // Mapping from pengumpulanId (UUID from DB) to Grade
    mapping(string => Grade) private grades;

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Record a student's grade for an assignment.
     * @param pengumpulanId The UUID of the submission from the database.
     * @param student The wallet address of the student.
     * @param grade The grade scored (multiplied by 100 to support 2 decimals, e.g. 85.50 -> 8550).
     * @param classId The UUID of the class from the database.
     */
    function recordGrade(string memory pengumpulanId, address student, uint256 grade, string memory classId) public onlyOwner {
        require(!grades[pengumpulanId].exists, "Grade for this submission already recorded");

        grades[pengumpulanId] = Grade({
            student: student,
            grade: grade,
            classId: classId,
            timestamp: block.timestamp,
            exists: true
        });

        emit GradeRecorded(pengumpulanId, student, grade, classId);
    }

    /**
     * @dev Get a recorded grade.
     */
    function getGrade(string memory pengumpulanId) public view returns (address, uint256, string memory, uint256) {
        require(grades[pengumpulanId].exists, "Grade not found");
        Grade memory g = grades[pengumpulanId];
        return (g.student, g.grade, g.classId, g.timestamp);
    }
}
