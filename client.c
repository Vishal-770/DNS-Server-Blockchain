unsigned int recv_checksum = atoi(buffer);
unsigned int calc_checksum = calculate_checksum(msg, strlen(msg));
if (recv_checksum == calc_checksum) {
printf("   ✅ Checksum OK\n");
send(client_fd, "ACK: Checksum OK", 16, 0);
    } else {
            printf("   ❌ Checksum Mismatch\n");
            send(client_fd, "NACK: Checksum Mismatch", 23, 0);
        }
    }

    close(client_fd);
    close(server_fd);
    return 0;
}
