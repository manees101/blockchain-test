// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BooksLibrary {
    mapping(uint256 => Book) public books;
    struct Book {
        string author;
        string title;
    }
    mapping(address => mapping(uint256 => Book)) myBooks;
    mapping(address => uint256) myBooksCount;
    event bookAdded(uint indexed _index, string _author, string _title);
    event myBookAdded(address indexed user, uint indexed _id, string author, string title);
    function getMybooksCount() public view returns (uint256) {
        return myBooksCount[msg.sender];
    }

    function addBook(
        uint256 _index,
        string memory _author,
        string memory _title
    ) public {
        require(bytes(books[_index].title).length==0,"Book already exist at this index");
        books[_index] = Book(_author, _title);
        emit bookAdded(_index, _author, _title);
    }

    function addMyBook(
        uint256 _id,
        string memory _author,
        string memory _title
    ) public {
        require(bytes(myBooks[msg.sender][_id].title).length==0,"Book already exists at this ID for the user");
        myBooks[msg.sender][_id] = Book(_author, _title);
        myBooksCount[msg.sender]++;
    }

    function getMyBooks(uint256[] memory _ids)
        public
        view
        returns (Book[] memory)
    {
        require(_ids.length>0,"Please at least one ID");
        // Create an array to store the books
        Book[] memory userBooks = new Book[](_ids.length);

        // Loop through the provided IDs and fetch each book
        for (uint256 i = 0; i < _ids.length; i++) {
            require(bytes(myBooks[msg.sender][_ids[i]].title).length != 0, "Book does not exist at this ID");
            userBooks[i] = myBooks[msg.sender][_ids[i]];
        }

        return userBooks;
    }
}
