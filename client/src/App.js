import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Heading,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import Chart from 'react-apexcharts';

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});
  const [scores, setScores] = useState([]);
  const [names, setNames] = useState([]);

  useEffect(() => {
    const socket = socketIOClient('http://localhost:5500/api/socket');

    const fetchScores = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5500/api/leaderboard'
        );

        setLeaderboard(data);
        const newHighestScores = data?.map(score => score?.score);
        const newLeaderboards = data?.map(score => score?.username);

        setScores([...newHighestScores]);
        setNames([...newLeaderboards]);
      } catch (error) {
        console.log(error.message);
      }
    };

    socket.on('newScore', latestScores => {
      setLeaderboard(latestScores);
      fetchScores();
    });

    fetchScores();
  }, []);

  useEffect(() => {
    setSeries([
      ...[
        {
          name: 'Score',
          data: scores,
        },
      ],
    ]);

    setOptions({
      chart: {
        id: 'apexchart-example',
      },
      xaxis: {
        categories: names,
      },
    });
  }, [names, scores]);

  const fetchLatestScores = useMemo(() => {
    if (leaderboard.length === 0) {
      return (
        <>
          <p>Loading...</p>
        </>
      );
    }

    return (
      <Box>
        <Container>
          <Heading as='h1' size='lg'>
            Leaderboard
          </Heading>

          <Table size='md'>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th isNumeric>Score</Th>
                <Th isNumeric>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {leaderboard.map(score => (
                <Tr key={score._id}>
                  <Td>{score.userId}</Td>
                  <Td>{score.username}</Td>
                  <Td>{score.score}</Td>
                  <Td>{dayjs(score.createdAt).format('YYYY:MM:DD')}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Chart
            options={options}
            series={[...series]}
            type='bar'
            height={350}
          />
        </Container>
      </Box>
    );
  }, [leaderboard, options, series]);

  return fetchLatestScores;
}

export default App;
