#!/usr/bin/env python

#Sudoku Solver
#CLI-based sudoku puzzle solver for up to hard-level problems. 
#Solves puzzles that do not require X Wing or Swordfish strategies.
#Michael Ge, 2015
#Python 3

#removes from a spot, returning updated grid
def remove(arr, n, row, col):
    if type(arr[row][col]) is not int:
        if {n}.issubset(arr[row][col]):
            arr[row][col].remove(n)
            if len(arr[row][col]) == 1:
                   arr[row][col] = arr[row][col].pop()
                   arr = removeAll(arr, arr[row][col], row, col)
    return arr

#removes element from all sets in row, returning updated grid
def removeFromRow(arr, n, row):
    for j in range(9):
        arr = remove(arr, n, row, j)
    return arr

#removes element from all sets in col, returning updated grid
def removeFromCol(arr, n, col):
    for k in range(9):
        arr = remove(arr, n, k, col)
    return arr

#removes element from all sets in box, retruning updated grid
def removeFromBox(arr, n, row, col):
    grid = (int(row / 3), int(col / 3))
    for k in range(3 * grid[0], 3 * grid[0] + 3):
        for j in range(3 * grid[1], 3 * grid[1] + 3):
            arr = remove(arr, n, k, j)
    return arr

#calls all removal methods of a number
def removeAll(arr, n, row, col):
    arr = removeFromRow(arr, n, row)
    arr = removeFromCol(arr, n, col)
    arr = removeFromBox(arr, n, row, col)
    return arr

#remove n from sets in row excluding box containing the coordinates (row, col)
def deduceRow(arr, n, row, col):
    gcol = int(col / 3)
    for j in range(9):
        if j < 3 * gcol or j >= 3 * gcol + 3:
            arr = remove(arr, n, row, j)
    return arr
                
    
#remove n from sets in col excluding box containing the coordinates (row, col)
def deduceCol(arr, n, row, col):
    grow = int(row / 3)
    for k in range(9):
        if k < 3 * grow or k >= 3 * grow + 3:
            arr = remove(arr, n, k, col)
    return arr
    
#returns an array of all spots in box where n may be filled as tuples (n, row, col)
def deduceBox(arr, n, row, col):
    grid = (int(row / 3), int(col / 3))
    duplicates = []
    for k in range(3 * grid[0], 3 * grid[0] + 3):
        for j in range(3 * grid[1], 3 * grid[1] + 3):
            if type(arr[k][j]) is not int:
                if {n}.issubset(arr[k][j]):
                    duplicates.append((n,k,j))
            elif arr[k][j] == n:
                return []
    return duplicates

#converts CSV left to right, top to bottom into grid
def load():
    print("Please input the given board numbers from left to right, ", end="")
    print("top to bottom. Specify unknown values with any invalid value: ")
    s = input()
    temp = s.split(",")
    if len(temp) != 81:
        print("Invalid grid! Need 81 values.")
        return load()
    ctr = 0
    arr = []
    for row in range(9):
        arr.append([])
        for col in range(9):
            if (not temp[ctr].isdigit() or int(temp[ctr]) < 1 or
                int(temp[ctr]) > 9):
                arr[row].append({1,2,3,4,5,6,7,8,9})
            else:
                arr[row].append(int(temp[ctr]))
            ctr+=1
    return arr

# Checks if grid is correct, prints errors for conflicts
def hasErrors(grid):
    error = False
    for k in range(9):
        s = {1,2,3,4,5,6,7,8,9}
        for j in range(9):
            if {grid[k][j]}.issubset(s):
                s.remove(grid[k][j])
            else:
                print("Mistake at (" + str(k) + ", " + str(j) + ") value " + str(grid[k][j]) + ".")
                error = True
    for j in range(9):
        s = {1, 2, 3, 4, 5, 6, 7, 8, 9}
        for k in range(9):
            if {grid[k][j]}.issubset(s):
                s.remove(grid[k][j])
            else:
                print("Mistake at (" + str(k) + ", " + str(j) + ") value " + str(grid[k][j]) + ".")
                error = True
    return error
            
# Prints a sudoku box
def printGrid(grid):
    print(" --- --- ---     --- --- ---     --- --- ---")
    ctr = 0
    for boxrow in range(3):
        for gridrow in range(3):
            print("| ", end="")
            for boxcol in range(3):
                for gridcol in range(3):
                    if type(grid[int(ctr/9)][ctr%9]) is not int:
                        print("  | ", end="")
                    else:
                        print(str(grid[int(ctr / 9)][ctr % 9]) + " | ", end="")
                    ctr+=1
                if boxcol % 3 != 2:
                    print("  | ", end="")
            print()
            print(" --- --- ---     --- --- ---     --- --- ---")
        print()
        if boxrow != 2:
            print(" --- --- ---     --- --- ---     --- --- ---")

#main function
def main():
    print()
    print("Welcome to Sudoku Solver")
    print()
    #loads grid
    ok = False
    while not ok:
        grid = load()
        printGrid(grid)
        s = input("Solve this board? ")
        if s.upper() == "YES" or s.upper() == "Y":
            ok = True
    print("Calculating...")
            
    #initially removes based on given numbers
    for k in range(9):
        for j in range(9):
            if type(grid[k][j]) is int:
                arr = removeAll(grid, grid[k][j], k, j)

    #calculates rest of numbers
    done = False
    ctr = 0
    while not done and ctr < 100:
        done = True
        for k in range(9):
            for j in range(9):
                if type(grid[k][j]) is int:
                    grid = removeAll(grid, grid[k][j], k, j)
                else:
                    done = False
                    dup = []
                    for i in grid[k][j]:
                        dup.append(deduceBox(grid, i, k, j))
                    for duplicates in dup:
                        x = duplicates[0][1]
                        y = duplicates[0][2]
                        val = duplicates[0][0]
                        if len(duplicates) == 1:
                            grid[x][y] = val
                            grid = removeAll(grid, val, x, y)
                        else:
                            sameRow = True
                            sameCol = True
                            for coord in duplicates:
                                if coord[1] != x:
                                    sameRow = False
                                if coord[2] != y:
                                    sameCol = False
                            if sameRow:
                                grid = deduceRow(grid, val, x, y)
                            if sameCol:
                                grid = deduceCol(grid, val, x, y)
        ctr += 1

    #case for infinite loop
    if not done:
        x = input("Can't solve it! Show solution so far? ")
        if x.upper() == "YES" or x.upper() == "Y":
            printGrid(grid)
        while True:
            coord = input("Enter coordinates to see value. ").split(",")
            print (grid[int(coord[0])][int(coord[1])])
    #checks work for completed solution
    else:
        print("Checking...")
        if hasErrors(grid):
            x = input("Show attempted solution anyway? ")
            if x.upper() == "YES" or x.upper() == "Y":
                printGrid(grid)
        else:
            printGrid(grid)
            print("Done!")
main()

''' 
Test grids

Easy
#,#,#,#,#,1,#,7,4,#,#,5,#,2,9,#,#,1,#,7,#,#,3,#,#,#,#,#,#,#,6,#,#,#,3,2,#,3,6,#,#,#,#,#,7,7,2,#,#,#,#,8,5,#,#,#,#,#,#,4,2,#,#,8,#,#,3,#,7,#,#,5,6,4,#,9,5,#,#,8,#

Easy
7,#,4,#,#,5,1,#,3,8,#,2,#,#,#,5,#,7,#,9,#,4,#,#,#,#,#,4,7,#,#,6,#,3,#,#,6,3,#,#,#,9,#,#,#,#,#,5,1,8,#,#,#,#,#,#,#,2,#,#,7,3,#,#,5,#,#,#,7,8,2,#,#,8,#,#,5,#,#,6,#

Medium
 ,4, ,7, , , ,9, , , , , , , , ,4,7,7, , , ,4,6,5, , ,2, , ,8, , ,9,3,1, , ,8, , , ,4, , ,1,7,4, , ,3, , ,2, , ,7,4,3, , , ,6,8,9, , , , , , , , ,1, , , ,2, ,5, 
Medium
8, ,5, , , ,7,6, , , , , , , , , ,5, , , , ,1,2, , ,3, , ,1,6,9, , , ,2,7, ,2,4, ,5,9, ,6,4, , , ,7,1,3, , ,1, , ,7,2, , , , ,3, , , , , , , , , ,9,8, , , ,6, ,7

Hard
9, , ,8,7, ,1, ,6, ,6, , , ,1,8, , , , ,8, , , , , , ,5, , , ,1,9, , , , ,8,4,7, ,5,2,1, , , , ,3,2, , , ,4, , , , , , ,4, , , , ,6,5, , , ,7, ,7, ,5, ,4,3, , ,8

V Hard (not solvable with current methods)
3, ,5, , ,8, , ,4, , , ,4,5, , ,1, ,1, ,8, , ,7,6, ,5, ,7,2, , , , , ,3, , , , ,2, , , , ,5, , , , , ,4,8, ,7, ,6,3, , ,8, ,1, ,9, , ,7,1, , , ,8, , ,5, , ,9, ,7

'''
