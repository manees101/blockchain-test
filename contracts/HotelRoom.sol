// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HotelRoom {
    address payable public owner;
    address public manager;
    enum roomStatus {
        Vacant,
        Occupied
    }

    struct Guest {
        string name;
        string email;
    }

    struct Room {
        string details;
        uint256 price;
        roomStatus status;
        Guest guest;
    }

    event RoomAdded(string details, uint256 price, roomStatus status);
    event RoomOccupied(uint256 id, uint256 price, Guest guest);
    event FundsWithdrawn(address indexed to, uint256 amount);
    modifier isOwner() {
        require(
            msg.sender == owner,
            "You must be the owner to perform this action"
        );
        _;
    }

    modifier isVacant(uint256 id) {
        require(
            rooms[id].status == roomStatus.Vacant,
            "Room is already occupied"
        );
        _;
    }

    Room[] public rooms;

    constructor() {
        owner = payable(msg.sender);
    }

    function addRoom(string memory _details, uint256 _price) public isOwner {
        rooms.push(Room(_details, _price, roomStatus.Vacant, Guest("", "")));
        emit RoomAdded(_details, _price, roomStatus.Vacant);
    }

    function bookRoom(
        uint256 roomId,
        string memory guestName,
        string memory guestEmail
    ) public payable isVacant(roomId) {
        require(
            rooms[roomId].price <= msg.value,
            "Booking cancelled: Not enough ether provided"
        );
        (bool sent, ) = owner.call{value: msg.value}("");
        require(sent, "Transaction Failed");
        rooms[roomId].status = roomStatus.Occupied;
        rooms[roomId].guest = Guest(guestName, guestEmail);
        emit RoomOccupied(roomId, msg.value, Guest(guestName, guestEmail));
    }

    function withdrawFunds(address payable _to) public isOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        require(_to != address(0), "Cannot withdraw to the zero address");

        (bool sent, ) = _to.call{value: balance}("");
        require(sent, "Failed to withdraw funds");

        emit FundsWithdrawn(_to, balance);
    }
}
