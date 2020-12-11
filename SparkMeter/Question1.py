if __name__ == '__main__':

    def print_3rds(arr):
        """ Response to Question 1:
            In the language of your choice, write code that prints every third element of this list using recursion. [1, 2, 3, 4, 5, 6, 7, 8, 9]. Please create a public Github or Gitlab snippet with your response and submit the link here. *
        """
        if len(arr) < 3:            # test for invalid input array length
            raise ValueError
        elif len(arr) == 3:         # base case
            print(arr[-1])
        else:
            if len(arr) % 3 == 0:
                print_3rds(arr[0:-3])
                print(arr[-1])
            else:
                print_3rds(arr[0:-1])

    array = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    print_3rds(array)
