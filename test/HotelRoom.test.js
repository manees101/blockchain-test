const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('HotelRoom', function () {
  let HotelRoom, hotel, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    HotelRoom = await ethers.getContractFactory('HotelRoom');
    hotel = await HotelRoom.deploy();
    await hotel.waitForDeployment();
  });

  it('owner can add a room and emits event', async function () {
    await expect(hotel.addRoom('Room 101', ethers.parseEther('0.1')))
      .to.emit(hotel, 'RoomAdded')
      .withArgs('Room 101', ethers.parseEther('0.1'), 0);

    const room = await hotel.rooms(0);
    expect(room.details).to.equal('Room 101');
    expect(room.price).to.equal(ethers.parseEther('0.1'));
    expect(room.status).to.equal(0);
  });

  it('non-owner cannot add a room', async function () {
    await expect(
      hotel.connect(user).addRoom('Room 102', ethers.parseEther('0.2'))
    ).to.be.revertedWith('You must be the owner to perform this action');
  });

  it('user can book a vacant room by paying at least the price', async function () {
    await hotel.addRoom('Room 101', ethers.parseEther('0.1'));

    await expect(
      hotel
        .connect(user)
        .bookRoom(0, 'Alice', 'alice@example.com', { value: ethers.parseEther('0.1') })
    ).to.emit(hotel, 'RoomOccupied');

    const room = await hotel.rooms(0);
    expect(room.status).to.equal(1); // Occupied
    expect(room.guest.name).to.equal('Alice');
  });

  it('reverts booking if insufficient ether', async function () {
    await hotel.addRoom('Room 101', ethers.parseEther('0.5'));
    await expect(
      hotel.connect(user).bookRoom(0, 'Bob', 'bob@example.com', { value: ethers.parseEther('0.1') })
    ).to.be.revertedWith('Booking cancelled: Not enough ether provided');
  });

  it('cannot book an occupied room', async function () {
    await hotel.addRoom('Room 101', ethers.parseEther('0.1'));
    await hotel.connect(user).bookRoom(0, 'Alice', 'alice@example.com', { value: ethers.parseEther('0.1') });

    await expect(
      hotel.connect(user).bookRoom(0, 'Bob', 'bob@example.com', { value: ethers.parseEther('0.2') })
    ).to.be.revertedWith('Room is already occupied');
  });
});
