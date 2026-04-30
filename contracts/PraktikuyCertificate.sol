// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PraktikuyCertificate is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Event emitted when a new certificate is minted
    event CertificateMinted(address indexed student, uint256 indexed tokenId, string tokenURI);

    constructor(address initialOwner) ERC721("PraktikuyCertificate", "PRKTCERT") Ownable(initialOwner) {}

    /**
     * @dev Mint a new certificate to a student.
     * @param student The address of the student receiving the certificate.
     * @param uri The URI containing the metadata for the certificate.
     * @return The ID of the newly minted token.
     */
    function mintCertificate(address student, string memory uri) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(student, tokenId);
        _setTokenURI(tokenId, uri);

        emit CertificateMinted(student, tokenId, uri);

        return tokenId;
    }
}
