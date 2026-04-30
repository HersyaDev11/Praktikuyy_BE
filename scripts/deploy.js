import hardhat from "hardhat";

async function main() {
  const [deployer] = await hardhat.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Certificate Contract
  const Certificate = await hardhat.ethers.getContractFactory("PraktikuyCertificate");
  const certificate = await Certificate.deploy(deployer.address);
  await certificate.waitForDeployment();
  console.log("PraktikuyCertificate deployed to:", await certificate.getAddress());

  // Deploy Grades Contract
  const Grades = await hardhat.ethers.getContractFactory("PraktikuyGrades");
  const grades = await Grades.deploy(deployer.address);
  await grades.waitForDeployment();
  console.log("PraktikuyGrades deployed to:", await grades.getAddress());
}
// BRADERRRR IYEUU BUAT DEPLOYY YAAA SIRRR....
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
