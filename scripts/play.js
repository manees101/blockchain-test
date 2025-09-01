const addrs = require('../deployments/localhost.json')
const runHotelRoomExample = async () => {
  const HotelRoom = await ethers.getContractAt('HotelRoom', addrs.hotelRoom)

  // Add a room (owner = default signer[0])
  await HotelRoom.addRoom('Room 1012', ethers.parseEther('0.1'))
  const r0 = await HotelRoom.rooms(0)
  r0.details  // => 'Room 101'
  r0.status   // => 0 (Vacant)

  // Book from a different user (signer[1])
  const [, user] = await ethers.getSigners()
  await HotelRoom.connect(user).bookRoom(
    0, 'Alice', 'alice@example.com',
    { value: ethers.parseEther('0.1') }
  )
  const r = await HotelRoom.rooms(0)
  r.status  // => 1 (Occupied)
  r.guest.name // => 'Alice'

  // Negative case: insufficient ETH
  await HotelRoom.connect(user).bookRoom(0, 'Bob', 'bob@ex.com', { value: ethers.parseEther('0.01') })
} // expect revert

runHotelRoomExample()