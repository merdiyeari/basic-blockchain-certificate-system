// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateSystem {
    struct Certificate {
        string studentName;
        uint256 issueDate;
        uint256 grade;
        string courseName;
    }
    
    // ID'ye göre sertifikaları saklar
    mapping(uint256 => Certificate) public certificates;
    
    // Yeni sertifika ekleme
    function addCertificate(
        uint256 _id,
        string memory _studentName,
        uint256 _grade,
        string memory _courseName
    ) public {
        require(bytes(_studentName).length > 0, "Ogrenci adi bos olamaz");
        require(_grade <= 100, "Not 100'den buyuk olamaz");
        
        certificates[_id] = Certificate(
            _studentName,
            block.timestamp,
            _grade,
            _courseName
        );
    }
    
    // Sertifika sorgulama
    function getCertificate(uint256 _id) public view returns (
        string memory,
        uint256,
        uint256,
        string memory
    ) {
        require(certificates[_id].issueDate > 0, "Bu ID'ye ait sertifika bulunamadi");
        Certificate memory cert = certificates[_id];
        return (
            cert.studentName,
            cert.issueDate,
            cert.grade,
            cert.courseName
        );
    }
}